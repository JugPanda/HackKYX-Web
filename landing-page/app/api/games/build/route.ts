import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { z } from "zod";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const buildRequestSchema = z.object({
  gameId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Rate limiting - 5 builds per hour
    if (!rateLimit(`build:${user.id}`, RATE_LIMITS.BUILD)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. You can only build 5 games per hour." },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const validation = buildRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { gameId } = validation.data;

    // Fetch the game
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("id, user_id, config, generated_code, language, status, bundle_url")
      .eq("id", gameId)
      .single();

    if (gameError || !game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (game.user_id !== user.id) {
      return NextResponse.json(
        { error: "You do not have permission to build this game" },
        { status: 403 }
      );
    }

    // Check if game is already building
    if (game.status === "building") {
      return NextResponse.json(
        { error: "Game is already building" },
        { status: 400 }
      );
    }

    // Check for existing pending/processing build
    const { data: existingBuild } = await supabase
      .from("build_queue")
      .select("id, status")
      .eq("game_id", gameId)
      .in("status", ["pending", "processing"])
      .maybeSingle();

    if (existingBuild) {
      return NextResponse.json(
        { error: "A build is already in progress for this game" },
        { status: 400 }
      );
    }

    // Update game status to building
    const { error: updateError } = await supabase
      .from("games")
      .update({ status: "building" })
      .eq("id", gameId);

    if (updateError) {
      console.error("Failed to update game status:", updateError);
      return NextResponse.json(
        { error: "Failed to start build" },
        { status: 500 }
      );
    }

    // Create build queue entry
    const { data: buildJob, error: buildError } = await supabase
      .from("build_queue")
      .insert({
        game_id: gameId,
        user_id: user.id,
        status: "pending",
      })
      .select()
      .single();

    if (buildError || !buildJob) {
      console.error("Failed to create build job:", buildError);
      
      // Rollback game status
      await supabase
        .from("games")
        .update({ status: "draft" })
        .eq("id", gameId);
      
      return NextResponse.json(
        { error: "Failed to queue build" },
        { status: 500 }
      );
    }

    // Trigger build service
    const buildServiceUrl = process.env.BUILD_SERVICE_URL;
    const buildServiceSecret = process.env.BUILD_SERVICE_SECRET;

    if (!buildServiceUrl || !buildServiceSecret) {
      // Update build job status to failed
      await supabase
        .from("build_queue")
        .update({ 
          status: "failed",
          error_message: "Build service not configured",
          completed_at: new Date().toISOString()
        })
        .eq("id", buildJob.id);

      await supabase
        .from("games")
        .update({ status: "failed" })
        .eq("id", gameId);

      return NextResponse.json(
        { error: "Build service not configured" },
        { status: 500 }
      );
    }

    // Call build service asynchronously (fire and forget)
    const buildPayload = {
      buildId: buildJob.id,
      gameId: game.id,
      config: game.config,
      generatedCode: game.generated_code,
      language: game.language || "javascript",
      use_test_game: false,
    };

    // Trigger the build (don't await to return quickly)
    fetch(`${buildServiceUrl}/build`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Build-Secret": buildServiceSecret,
      },
      body: JSON.stringify(buildPayload),
    }).catch(async (error) => {
      console.error("Build service request failed:", error);
      
      // Update status on failure
      await supabase
        .from("build_queue")
        .update({ 
          status: "failed",
          error_message: "Failed to contact build service",
          completed_at: new Date().toISOString()
        })
        .eq("id", buildJob.id);

      await supabase
        .from("games")
        .update({ status: "failed" })
        .eq("id", gameId);
    });

    return NextResponse.json({ 
      success: true,
      buildId: buildJob.id,
      gameId: game.id,
      message: "Build started successfully"
    });

  } catch (error) {
    console.error("Build error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to check build status
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json(
        { error: "gameId is required" },
        { status: 400 }
      );
    }

    // Fetch build status
    const { data: buildJob, error } = await supabase
      .from("build_queue")
      .select("id, status, error_message, created_at, started_at, completed_at")
      .eq("game_id", gameId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch build status:", error);
      return NextResponse.json(
        { error: "Failed to fetch build status" },
        { status: 500 }
      );
    }

    if (!buildJob) {
      return NextResponse.json(
        { status: "not_found", message: "No build found for this game" }
      );
    }

    return NextResponse.json({ 
      buildId: buildJob.id,
      status: buildJob.status,
      errorMessage: buildJob.error_message,
      createdAt: buildJob.created_at,
      startedAt: buildJob.started_at,
      completedAt: buildJob.completed_at,
    });

  } catch (error) {
    console.error("Build status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

    const { gameId } = await request.json();

    if (!gameId) {
      return NextResponse.json(
        { error: "gameId is required" },
        { status: 400 }
      );
    }

    // Verify game ownership
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .eq("user_id", user.id)
      .single();

    if (gameError || !game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    // Check if game has code to build
    if (!game.generated_code && game.language !== "javascript") {
      return NextResponse.json(
        { error: "Game code not found. Please generate the game code first." },
        { status: 400 }
      );
    }

    // Check if build is already in progress
    if (game.status === "building") {
      return NextResponse.json(
        { error: "Build already in progress" },
        { status: 400 }
      );
    }

    // Create build queue entry
    const { data: buildJob, error: buildError } = await supabase
      .from("build_queue")
      .insert({
        game_id: game.id,
        user_id: user.id,
        status: "pending",
      })
      .select()
      .single();

    if (buildError || !buildJob) {
      console.error("Failed to create build job:", buildError);
      return NextResponse.json(
        { error: "Failed to queue build" },
        { status: 500 }
      );
    }

    // Update game status to building
    await supabase
      .from("games")
      .update({ status: "building" })
      .eq("id", gameId);

    // Trigger build service
    const buildServiceUrl = process.env.BUILD_SERVICE_URL;
    const buildServiceSecret = process.env.BUILD_SERVICE_SECRET;

    if (!buildServiceUrl || !buildServiceSecret) {
      // If build service is not configured, return success but note it's queued
      return NextResponse.json({ 
        success: true,
        game_id: game.id,
        message: "Build queued. Build service will process it shortly."
      });
    }

    try {
      const buildResponse = await fetch(`${buildServiceUrl}/build`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Build-Secret": buildServiceSecret,
        },
        body: JSON.stringify({
          buildId: buildJob.id,
          gameId: game.id,
          config: game.config,
          generatedCode: game.generated_code,
          language: game.language || "python",
          use_test_game: false,
        }),
      });

      if (!buildResponse.ok) {
        const errorText = await buildResponse.text();
        console.error("Build service error:", errorText);
        
        // Update game status to failed
        await supabase
          .from("games")
          .update({ status: "failed" })
          .eq("id", gameId);
        
        return NextResponse.json(
          { error: "Build service error", details: errorText },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true,
        game_id: game.id,
        message: "Build started successfully"
      });
    } catch (fetchError) {
      console.error("Error calling build service:", fetchError);
      // Don't fail - the build service might process it from the queue
      return NextResponse.json({ 
        success: true,
        game_id: game.id,
        message: "Build queued. Build service will process it shortly."
      });
    }

  } catch (error) {
    console.error("Build error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { createClient } from "@/lib/supabase/server";
import { gameConfigSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, description, config, generatedCode } = body;

    // Validate config
    const validation = gameConfigSchema.safeParse(config);
    if (!validation.success) {
      console.error("Game config validation failed:", validation.error.issues);
      console.error("Received config:", JSON.stringify(config, null, 2));
      return NextResponse.json(
        { error: "Invalid game configuration", issues: validation.error.issues },
        { status: 400 }
      );
    }

    // Check if slug is provided, otherwise generate one
    const finalSlug = slug || 
      title.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + 
      "-" + Date.now();

    // Check if slug is unique for this user
    const { data: existingGame } = await supabase
      .from("games")
      .select("id")
      .eq("user_id", user.id)
      .eq("slug", finalSlug)
      .single();

    if (existingGame) {
      // If slug exists, append timestamp to make it unique
      const uniqueSlug = `${finalSlug}-${Date.now()}`;
      const { data: game, error: gameError } = await supabase
        .from("games")
        .insert({
          user_id: user.id,
          slug: uniqueSlug,
          title,
          description,
          config: validation.data,
          generated_code: generatedCode || null, // Store AI-generated code
          status: "draft",
          visibility: "private",
        })
        .select()
        .single();

      if (gameError) {
        console.error("Error creating game:", gameError);
        return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
      }

      return NextResponse.json({ game }, { status: 201 });
    }

    // Create game record
    const { data: game, error: gameError } = await supabase
      .from("games")
      .insert({
        user_id: user.id,
        slug: finalSlug,
        title,
        description,
        config: validation.data,
        generated_code: generatedCode || null, // Store AI-generated code
        status: "draft",
        visibility: "private",
      })
      .select()
      .single();

    if (gameError) {
      console.error("Error creating game:", gameError);
      return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
    }

    return NextResponse.json({ game }, { status: 201 });
  } catch (error) {
    console.error("Error in create game:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


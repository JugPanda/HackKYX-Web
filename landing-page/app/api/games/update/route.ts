import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { gameConfigSchema } from "@/lib/schemas";
import { visibilitySchema, gameIdSchema, safeJsonParse } from "@/lib/validation";
import { z } from "zod";

// PATCH request schema for visibility updates
const patchGameSchema = z.object({
  gameId: gameIdSchema,
  visibility: visibilitySchema,
});

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request
    const parseResult = await safeJsonParse(request, patchGameSchema);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error }, { status: 400 });
    }

    const { gameId, visibility } = parseResult.data;

    // Verify game ownership
    const { data: existingGame, error: fetchError } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Update visibility
    const { data: updatedGame, error: updateError } = await supabase
      .from("games")
      .update({ visibility })
      .eq("id", gameId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating game visibility:", updateError);
      return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
    }

    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Error in update game visibility:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT request schema for full game updates
const putGameSchema = z.object({
  gameId: gameIdSchema,
  title: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  config: gameConfigSchema.optional(),
  generatedCode: z.string().max(100000).optional(),
});

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request
    const parseResult = await safeJsonParse(request, putGameSchema);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error }, { status: 400 });
    }

    const { gameId, title, description, config, generatedCode } = parseResult.data;

    // Verify game ownership
    const { data: existingGame, error: fetchError } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Update game - config already validated by schema
    const updateData: {
      title?: string;
      description?: string;
      config?: typeof config;
      generated_code?: string | null;
      status?: string;
    } = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (config !== undefined) updateData.config = config;
    if (generatedCode !== undefined) updateData.generated_code = generatedCode || null;
    
    // Reset status to draft if config or code changed
    if (config !== undefined || generatedCode !== undefined) {
      updateData.status = "draft";
    }

    const { data: updatedGame, error: updateError } = await supabase
      .from("games")
      .update(updateData)
      .eq("id", gameId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating game:", updateError);
      return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
    }

    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Error in update game:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


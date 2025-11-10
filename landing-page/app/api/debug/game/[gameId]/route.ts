import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const gameId = params.gameId;

    // Get game from database
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

    if (gameError || !game) {
      return NextResponse.json({
        success: false,
        error: "Game not found in database",
        details: gameError
      }, { status: 404 });
    }

    // Check if files exist in storage
    const storagePath = `games/${gameId}/`;
    const { data: files, error: listError } = await supabase.storage
      .from("game-bundles")
      .list(storagePath);

    return NextResponse.json({
      success: true,
      game: {
        id: game.id,
        title: game.title,
        status: game.status,
        visibility: game.visibility,
        bundle_url: game.bundle_url,
        created_at: game.created_at,
        published_at: game.published_at,
      },
      storage: {
        path: storagePath,
        files: files || [],
        error: listError
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}


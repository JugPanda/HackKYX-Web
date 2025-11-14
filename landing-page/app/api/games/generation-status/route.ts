import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Check the status of async game generation
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json(
        { error: "Missing gameId parameter" },
        { status: 400 }
      );
    }

    // Fetch game status
    const { data: game, error } = await supabase
      .from("games")
      .select("id, status, generated_code, updated_at")
      .eq("id", gameId)
      .eq("user_id", user.id)
      .single();

    if (error || !game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      gameId: game.id,
      status: game.status,
      hasCode: !!game.generated_code,
      updatedAt: game.updated_at,
    });

  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}


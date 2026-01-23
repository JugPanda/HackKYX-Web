import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { gameIdSchema } from "@/lib/validation";

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json({ error: "gameId is required" }, { status: 400 });
    }

    // Validate game ID format
    const validation = gameIdSchema.safeParse(gameId);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    // Verify game ownership
    const { data: game, error: fetchError } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Delete from storage if bundle exists
    if (game.bundle_url) {
      try {
        // List all files in the games/{gameId}/ folder
        const { data: fileList, error: listError } = await supabase.storage
          .from("game-bundles")
          .list(`games/${gameId}`);

        if (!listError && fileList && fileList.length > 0) {
          // Create array of file paths to delete
          const filesToDelete = fileList.map(file => `games/${gameId}/${file.name}`);
          
          // Delete all files
          const { error: removeError } = await supabase.storage
            .from("game-bundles")
            .remove(filesToDelete);

          if (removeError) {
            console.error("Error removing files from storage:", removeError);
          }
        }
      } catch (storageError) {
        console.error("Error deleting game bundle from storage:", storageError);
        // Continue with deletion even if storage cleanup fails
      }
    }

    // Delete the game (cascade will handle build_queue, likes, comments, reports)
    const { error: deleteError } = await supabase
      .from("games")
      .delete()
      .eq("id", gameId);

    if (deleteError) {
      console.error("Error deleting game:", deleteError);
      return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
    }

    return NextResponse.json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("Error in delete game:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


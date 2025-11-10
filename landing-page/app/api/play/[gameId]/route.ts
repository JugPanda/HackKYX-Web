import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { gameId } = params;
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file') || 'index.html';

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the game's bundle_url from database
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("bundle_url")
      .eq("id", gameId)
      .single();

    if (gameError || !game) {
      return new NextResponse("Game not found", { status: 404 });
    }

    // Extract the storage path from bundle_url
    // bundle_url looks like: https://...supabase.co/storage/v1/object/public/game-bundles/games/{gameId}/index.html
    const storagePath = `games/${gameId}/${file}`;

    // Download the file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from("game-bundles")
      .download(storagePath);

    if (fileError || !fileData) {
      console.error("File download error:", fileError);
      return new NextResponse("File not found", { status: 404 });
    }

    // Determine content type based on file extension
    let contentType = "text/html";
    if (file.endsWith(".js")) {
      contentType = "application/javascript";
    } else if (file.endsWith(".wasm")) {
      contentType = "application/wasm";
    } else if (file.endsWith(".png")) {
      contentType = "image/png";
    } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (file.endsWith(".apk")) {
      contentType = "application/vnd.android.package-archive";
    }

    // Convert blob to array buffer
    const arrayBuffer = await fileData.arrayBuffer();

    // Return with correct content type
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}


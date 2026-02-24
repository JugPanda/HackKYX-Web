import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { buildGameGenerationPrompt, buildJavaScriptGamePrompt, type GameGenerationRequest } from "@/lib/game-generator";

// This endpoint starts async generation and returns immediately
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for background processing

// Lazy-initialize OpenAI client to avoid build-time errors
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { gameId, gameRequest } = body as { 
      gameId: string; 
      gameRequest: GameGenerationRequest 
    };

    if (!gameId || !gameRequest) {
      return NextResponse.json(
        { error: "Missing gameId or gameRequest" },
        { status: 400 }
      );
    }

    // Start background generation (this will run after response is sent)
    // We'll do it synchronously here since Vercel doesn't support true background jobs on Hobby
    // But we'll stream the response to avoid timeout
    
    // console.log(`[Async Gen] Starting generation for game ${gameId}`);

    // Update game status to generating
    await supabase
      .from("games")
      .update({ 
        status: "generating",
        updated_at: new Date().toISOString()
      })
      .eq("id", gameId)
      .eq("user_id", user.id);

    // Return immediately - generation will continue
    const responsePromise = NextResponse.json({
      ok: true,
      message: "Generation started",
      gameId,
      status: "generating"
    });

    // Start generation in background (after response)
    generateGameCodeAsync(gameId, gameRequest, user.id).catch(console.error);

    return responsePromise;

  } catch (error) {
    console.error("Async generation error:", error);
    return NextResponse.json(
      { error: "Failed to start generation" },
      { status: 500 }
    );
  }
}

// Background generation function
async function generateGameCodeAsync(
  gameId: string,
  gameRequest: GameGenerationRequest,
  userId: string
) {
  const supabase = await createClient();
  const openai = getOpenAIClient();
  
  try {
    // console.log(`[Async Gen] Generating code for game ${gameId}...`);

    // Build the prompt
    const language = gameRequest.language || "python";
    const prompt = language === "javascript" 
      ? buildJavaScriptGamePrompt(gameRequest)
      : buildGameGenerationPrompt(gameRequest);

    const systemPrompt = language === "javascript"
      ? `You are an expert game developer specializing in HTML5 Canvas and JavaScript game development.
Generate COMPLETE, WORKING game code that runs in the browser.
Focus on: working controls, collision detection, game states, and polished visuals.
Return ONLY the complete HTML file with embedded JavaScript and CSS.`
      : `You are an expert Python game developer specializing in Pygame.
Generate COMPLETE, WORKING Pygame code that compiles with Pygbag for WebAssembly.
Focus on: working controls, collision detection, game states, and polished visuals.
Return ONLY the complete Python code with proper async/await structure.`;

    // Call OpenAI (this can take 30-60 seconds, but we have 5 min timeout)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const generatedCode = completion.choices[0]?.message?.content;

    if (!generatedCode) {
      throw new Error("No code generated from AI");
    }

    // console.log(`[Async Gen] Code generated for game ${gameId}, updating database...`);

    // Update game with generated code
    const { error: updateError } = await supabase
      .from("games")
      .update({ 
        generated_code: generatedCode,
        status: "draft", // Ready to build
        updated_at: new Date().toISOString()
      })
      .eq("id", gameId)
      .eq("user_id", userId);

    if (updateError) {
      throw updateError;
    }

    // console.log(`[Async Gen] Successfully completed generation for game ${gameId}`);

  } catch (error) {
    console.error(`[Async Gen] Error generating game ${gameId}:`, error);
    
    // Update game with error status
    await supabase
      .from("games")
      .update({ 
        status: "error",
        updated_at: new Date().toISOString()
      })
      .eq("id", gameId)
      .eq("user_id", userId);
  }
}


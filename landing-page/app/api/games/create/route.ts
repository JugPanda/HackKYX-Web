import { createClient } from "@/lib/supabase/server";
import { gameConfigSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { titleSchema, descriptionSchema, languageSchema, safeJsonParse } from "@/lib/validation";
import { sanitizeText, generateSlug } from "@/lib/content-filter";
import { canCreateGame } from "@/lib/subscription-limits";
import { z } from "zod";

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';

// Request body schema
const createGameSchema = z.object({
  slug: z.string().optional(),
  title: titleSchema,
  description: descriptionSchema,
  config: gameConfigSchema,
  generatedCode: z.string().max(100000).optional(),
  language: languageSchema.optional(),
});

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

    // Rate limiting
    if (!rateLimit(`create-game:${user.id}`, RATE_LIMITS.CREATE_GAME)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Fetch user profile with subscription data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("subscription_tier, games_created_this_month")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    // Check if user can create more games based on subscription tier
    if (!canCreateGame(profile.subscription_tier as any, profile.games_created_this_month)) {
      return NextResponse.json(
        { 
          error: "Monthly game limit reached",
          message: `You've reached your monthly limit. Upgrade to create more games.`,
          tier: profile.subscription_tier,
          gamesCreated: profile.games_created_this_month
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const parseResult = await safeJsonParse(request, createGameSchema);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error }, { status: 400 });
    }

    const { slug, title, description, config, generatedCode, language } = parseResult.data;

    // Generate slug from title if not provided
    const finalSlug = slug || generateSlug(title) + "-" + Date.now();

    // Check if slug is unique for this user
    const { data: existingGame } = await supabase
      .from("games")
      .select("id")
      .eq("user_id", user.id)
      .eq("slug", finalSlug)
      .single();

    // If slug exists, append timestamp to make it unique
    let finalSlugToUse = finalSlug;
    if (existingGame) {
      finalSlugToUse = `${finalSlug}-${Date.now()}`;
    }

    // Create game record
    const { data: game, error: gameError } = await supabase
      .from("games")
      .insert({
        user_id: user.id,
        slug: finalSlugToUse,
        title: sanitizeText(title, 100),
        description: sanitizeText(description, 500),
        config,
        generated_code: generatedCode || null,
        language: language || "python",
        status: "draft",
        visibility: "private",
      })
      .select()
      .single();

    if (gameError) {
      console.error("Error creating game:", gameError);
      return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
    }

    // Increment games_created_this_month counter
    const { error: counterError } = await supabase
      .from("profiles")
      .update({ 
        games_created_this_month: profile.games_created_this_month + 1 
      })
      .eq("id", user.id);

    if (counterError) {
      console.error("Error incrementing game counter:", counterError);
      // Don't fail the request if counter update fails
    }

    return NextResponse.json({ game }, { status: 201 });
  } catch (error) {
    console.error("Error in create game:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


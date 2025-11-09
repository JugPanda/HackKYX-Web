/**
 * AI-powered game code generation
 * Generates Python Pygame code based on user descriptions
 */

export interface GameGenerationRequest {
  heroName: string;
  enemyName: string;
  goal: string;
  tone: "hopeful" | "gritty" | "heroic";
  difficulty: "rookie" | "veteran" | "nightmare";
  description?: string; // Optional longer description
}

export interface GeneratedGame {
  mainPy: string; // Generated main.py content
  configJson: object; // Generated config
  assets: Array<{ filename: string; content: string }>; // Any generated assets
}

/**
 * Generate a complete Python game using AI
 */
export async function generateGameCode(
  request: GameGenerationRequest
): Promise<GeneratedGame> {
  // This will call OpenAI or similar to generate game code
  const response = await fetch("/api/generate-game-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to generate game code");
  }

  return response.json();
}

/**
 * Build the prompt for AI code generation
 */
export function buildGameGenerationPrompt(
  request: GameGenerationRequest
): string {
  const difficultySettings = {
    rookie: { health: 5, enemySpeed: 1, enemyCount: "few" },
    veteran: { health: 3, enemySpeed: 1.5, enemyCount: "moderate" },
    nightmare: { health: 2, enemySpeed: 2, enemyCount: "many" },
  };

  const toneSettings = {
    hopeful: { colors: "bright greens and blues", music: "uplifting", atmosphere: "encouraging" },
    gritty: { colors: "dark grays and browns", music: "tense", atmosphere: "harsh and realistic" },
    heroic: { colors: "golds and oranges", music: "epic", atmosphere: "grand and adventurous" },
  };

  const diff = difficultySettings[request.difficulty];
  const mood = toneSettings[request.tone];

  return `Create a simple 2D platformer game in Python using Pygame.

**Game Setup:**
- Hero: ${request.heroName}
- Enemy: ${request.enemyName}
- Goal: ${request.goal}
- Health: ${diff.health} HP
- Colors: ${mood.colors}

**Requirements:**
1. Must use \`import asyncio\` and \`import pygame\`
2. Must have \`async def main()\` as entry point
3. Must call \`await asyncio.sleep(0)\` in the game loop
4. Keep it SIMPLE - basic platformer with player, 2-3 platforms, 1-2 enemies
5. Use rectangles for graphics (no images)
6. 800x600 screen size
7. Basic jump/move controls

Generate ONLY valid Python code. Keep it under 150 lines. Focus on working code, not complexity.`;
}


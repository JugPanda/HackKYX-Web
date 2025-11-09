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
  genre: "platformer" | "adventure" | "puzzle";
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
    hopeful: { colors: "bright greens and blues", atmosphere: "encouraging and uplifting" },
    gritty: { colors: "dark grays and browns", atmosphere: "harsh and realistic" },
    heroic: { colors: "golds and oranges", atmosphere: "grand and adventurous" },
  };

  const genreTemplates = {
    platformer: {
      description: "a 2D side-scrolling platformer",
      mechanics: `
- Gravity and jumping physics
- 2-3 platforms at different heights
- Player can move left/right (WASD or Arrow keys)
- Player can jump (Space or W/Up arrow)
- 1-2 enemies that patrol platforms
- Collision detection for platforms and enemies
- Player loses health on enemy contact`,
      gameplay: "Side-scrolling view. Player jumps between platforms, avoids enemies, reaches goal.",
    },
    adventure: {
      description: "a top-down adventure game (Zelda-style)",
      mechanics: `
- 8-directional movement (WASD or Arrow keys)
- Top-down view of a room/area
- Player can explore the entire screen
- 1-2 enemies that move around
- Simple collision with walls/boundaries
- Player loses health on enemy contact
- Collectible items or goal area to reach`,
      gameplay: "Top-down view. Player explores room, avoids/defeats enemies, collects items or reaches goal area.",
    },
    puzzle: {
      description: "a simple puzzle game",
      mechanics: `
- Grid-based or tile-based gameplay
- Mouse clicks or keyboard to interact
- Match-3, sliding puzzle, or similar mechanic
- Score tracking
- Simple win condition (reach score, solve puzzle)
- Visual feedback for moves
- Restart option`,
      gameplay: "Puzzle mechanics. Player solves puzzles by matching, sliding, or arranging elements.",
    },
  };

  const diff = difficultySettings[request.difficulty];
  const mood = toneSettings[request.tone];
  const genreInfo = genreTemplates[request.genre];

  return `Create ${genreInfo.description} in Python using Pygame.

**Game Info:**
- Hero: ${request.heroName}
- Enemy/Obstacle: ${request.enemyName}
- Goal: ${request.goal}
- Player Health: ${diff.health} HP
- Enemy Speed/Difficulty: ${request.difficulty}
- Visual Style: ${mood.colors}
- Atmosphere: ${mood.atmosphere}

**Core Mechanics:**${genreInfo.mechanics}

**CRITICAL Requirements:**
1. Must use \`import asyncio\` and \`import pygame\`
2. Must have \`async def main()\` as entry point
3. Must call \`await asyncio.sleep(0)\` at the end of the game loop
4. 800x600 screen size
5. Use simple shapes/rectangles (no images needed)
6. Include game over screen when health reaches 0
7. Include win screen when goal is reached

**Gameplay:**
${genreInfo.gameplay}

Generate ONLY the Python code. Keep it simple and under 200 lines. Focus on working, playable code.`;
}


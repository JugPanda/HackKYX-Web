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

  return `You are an expert Pygame developer. Generate a complete, working Python platformer game with the following specifications:

## Game Description
- **Hero**: ${request.heroName}
- **Enemy**: ${request.enemyName}
- **Goal**: ${request.goal}
- **Tone**: ${request.tone} (${mood.atmosphere})
- **Difficulty**: ${request.difficulty}
${request.description ? `- **Additional Context**: ${request.description}` : ""}

## Technical Requirements
1. Use Pygame-ce (browser-compatible)
2. Must work with pygbag (WebAssembly deployment)
3. Single file (main.py) with embedded game logic
4. Use HTML5 canvas rendering (no external assets required for now)
5. Responsive controls (WASD + Arrow keys, mobile-friendly)

## Game Mechanics
- **Player Health**: ${diff.health} hearts
- **Enemy Speed**: ${diff.enemySpeed}x base speed
- **Enemy Count**: ${diff.enemyCount} enemies per room
- **Platformer Movement**: Jump, run, optional dash
- **Multiple Rooms**: At least 3 connected rooms with portals
- **Collision Detection**: Platforms, enemies, collectibles
- **Win Condition**: ${request.goal}

## Aesthetics
- **Color Palette**: ${mood.colors}
- **Art Style**: Minimalist geometric shapes (rectangles, circles)
- **UI**: Clean HUD showing health, room name, goal progress
- **Atmosphere**: ${mood.atmosphere}

## Code Structure
\`\`\`python
import asyncio
import pygame
import json

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60

# Colors (${mood.colors})
COLOR_PLAYER = ...
COLOR_ENEMY = ...
COLOR_PLATFORM = ...
COLOR_BG = ...

# Classes
class Player:
    # Player with ${diff.health} health
    pass

class Enemy:
    # Enemy AI with ${diff.enemySpeed}x speed
    pass

class Platform:
    pass

class Room:
    # Room system with portals
    pass

class Game:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("${request.heroName}")
        self.clock = pygame.time.Clock()
        # Initialize game state
        
    async def run(self):
        # Main game loop compatible with pygbag
        while True:
            await asyncio.sleep(0)  # Critical for pygbag
            self.handle_events()
            self.update()
            self.draw()
            pygame.display.flip()
            self.clock.tick(FPS)

# Entry point for pygbag
async def main():
    game = Game()
    await game.run()

asyncio.run(main())
\`\`\`

Generate ONLY the complete Python code for main.py. Make it creative and unique based on the hero/enemy/goal provided.`;
}


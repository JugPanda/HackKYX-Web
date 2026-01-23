/**
 * Python/Pygame Game Builder
 * 
 * Builds games using Pygame-CE compiled to WebAssembly with Pygbag.
 * Marked as legacy - JavaScript is now the recommended option.
 */

import { GameBuilder, BuildResult, TemplateInfo, LanguageInfo } from "./base";
import { GameConfig } from "@/lib/schemas";
import { SubscriptionTier } from "@/lib/db-types";

export class PythonBuilder extends GameBuilder {
  readonly language = "python";
  
  readonly languageInfo: LanguageInfo = {
    id: "python",
    name: "python",
    displayName: "Python (Pygame)",
    description: "Classic Pygame games compiled to WebAssembly. Longer build times but familiar for Python developers.",
    icon: "🐍",
    status: "legacy",
    requiredTier: "free",
    features: [
      "Familiar Python syntax",
      "Pygame game library",
      "Compiled to WebAssembly",
      "Runs in browser"
    ],
    limitations: [
      "Longer build times (30-60 seconds)",
      "Larger bundle sizes",
      "Limited debugging in browser",
      "Async/await required for compatibility"
    ],
    estimatedBuildTime: "30-60 seconds",
    supportedPlatforms: ["Web"]
  };

  canBuild(config: GameConfig, userTier: SubscriptionTier): boolean {
    return this.canUseLanguage(userTier);
  }

  async build(gameId: string, code: string, config: GameConfig): Promise<BuildResult> {
    // Python builds are handled by the build service (pygbag compilation)
    // This is just a validation step
    const validation = this.validateCode(code);
    
    if (!validation.valid) {
      return {
        success: false,
        error: `Code validation failed: ${validation.errors.join(', ')}`,
      };
    }

    // Actual build happens in build service
    return {
      success: true,
    };
  }

  getTemplates(): TemplateInfo[] {
    return [
      {
        id: "py-platformer",
        name: "Platform Adventure (Python)",
        category: "platformer",
        description: "Classic platformer built with Pygame",
        difficulty: "rookie",
        requiredTier: "free",
        language: "python",
        codeTemplate: "base-platformer-python",
      },
      {
        id: "py-shooter",
        name: "Space Shooter (Python)",
        category: "shooter",
        description: "Shoot enemies with Pygame",
        difficulty: "rookie",
        requiredTier: "free",
        language: "python",
        codeTemplate: "base-shooter-python",
      },
    ];
  }

  async generateCode(prompt: string, config: GameConfig): Promise<string> {
    // Would use AI generation with Python-specific prompts
    return this.getStarterCode(config);
  }

  validateCode(code: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic Python validation
    if (!code.includes('import pygame')) {
      errors.push('Missing pygame import');
    }

    if (!code.includes('asyncio')) {
      // Warning - pygbag requires asyncio
      console.warn('No asyncio found - pygbag requires async main loop');
    }

    if (!code.includes('def main') && !code.includes('async def main')) {
      errors.push('No main function found');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  getStarterCode(_config: GameConfig): string {
    const { story } = _config;
    const playerName = story?.heroName || "Player";
    const enemyName = story?.enemyName || "Enemy";

    return `import asyncio
import pygame
import sys
import random

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
BLUE = (0, 217, 255)
RED = (255, 0, 85)
GRAY = (22, 33, 62)
DARK_BLUE = (15, 52, 96)

# Game configuration from template
CONFIG = ${JSON.stringify(_config, null, 2)}

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((40, 40))
        self.image.fill(BLUE)
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        self.velocity_y = 0
        self.speed = 5
        self.jump_power = -12
        self.is_jumping = False
        self.name = "${playerName}"
    
    def update(self, keys):
        # Movement
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.rect.x += self.speed
        
        # Gravity
        self.velocity_y += 0.5
        self.rect.y += self.velocity_y
        
        # Ground collision
        if self.rect.y >= SCREEN_HEIGHT - 90:
            self.rect.y = SCREEN_HEIGHT - 90
            self.velocity_y = 0
            self.is_jumping = False
        
        # Keep in bounds
        self.rect.x = max(0, min(SCREEN_WIDTH - self.rect.width, self.rect.x))
    
    def jump(self):
        if not self.is_jumping:
            self.velocity_y = self.jump_power
            self.is_jumping = True

class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((40, 40))
        self.image.fill(RED)
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        self.speed = 3
        self.name = "${enemyName}"
    
    def update(self):
        self.rect.x -= self.speed

class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("${playerName}'s Adventure")
        self.clock = pygame.time.Clock()
        self.running = True
        self.score = 0
        self.lives = 3
        
        # Sprites
        self.all_sprites = pygame.sprite.Group()
        self.enemies = pygame.sprite.Group()
        
        # Create player
        self.player = Player(100, SCREEN_HEIGHT - 100)
        self.all_sprites.add(self.player)
        
        # Enemy spawn timer
        self.spawn_timer = 0
        self.spawn_interval = 120  # frames
    
    def spawn_enemy(self):
        enemy = Enemy(SCREEN_WIDTH, SCREEN_HEIGHT - 100)
        self.all_sprites.add(enemy)
        self.enemies.add(enemy)
    
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            elif event.type == pygame.KEYDOWN:
                if event.key in (pygame.K_SPACE, pygame.K_UP, pygame.K_w):
                    self.player.jump()
    
    def update(self):
        keys = pygame.key.get_pressed()
        self.player.update(keys)
        
        # Update enemies
        for enemy in self.enemies:
            enemy.update()
            
            # Remove off-screen enemies
            if enemy.rect.right < 0:
                enemy.kill()
                self.score += 10
            
            # Collision detection
            if pygame.sprite.collide_rect(self.player, enemy):
                enemy.kill()
                self.lives -= 1
                if self.lives <= 0:
                    self.game_over()
        
        # Spawn enemies
        self.spawn_timer += 1
        if self.spawn_timer >= self.spawn_interval:
            self.spawn_enemy()
            self.spawn_timer = 0
    
    def render(self):
        # Background
        self.screen.fill(DARK_BLUE)
        
        # Ground
        pygame.draw.rect(self.screen, GRAY, (0, SCREEN_HEIGHT - 50, SCREEN_WIDTH, 50))
        
        # Sprites
        self.all_sprites.draw(self.screen)
        
        # Draw names
        font = pygame.font.Font(None, 20)
        
        # Player name
        name_surf = font.render(self.player.name, True, WHITE)
        name_rect = name_surf.get_rect(center=(self.player.rect.centerx, self.player.rect.top - 10))
        self.screen.blit(name_surf, name_rect)
        
        # Enemy names
        for enemy in self.enemies:
            name_surf = font.render(enemy.name, True, WHITE)
            name_rect = name_surf.get_rect(center=(enemy.rect.centerx, enemy.rect.top - 10))
            self.screen.blit(name_surf, name_rect)
        
        # UI
        ui_font = pygame.font.Font(None, 36)
        score_text = ui_font.render(f'Score: {self.score}', True, WHITE)
        lives_text = ui_font.render(f'Lives: {self.lives}', True, WHITE)
        self.screen.blit(score_text, (20, 20))
        self.screen.blit(lives_text, (20, 60))
        
        # Instructions
        if self.score == 0:
            inst_font = pygame.font.Font(None, 30)
            inst_text = inst_font.render('Arrow Keys/WASD to Move, Space to Jump', True, WHITE)
            inst_rect = inst_text.get_rect(center=(SCREEN_WIDTH // 2, 50))
            self.screen.blit(inst_text, inst_rect)
        
        pygame.display.flip()
    
    def game_over(self):
        print(f'Game Over! Final Score: {self.score}')
        self.running = False
    
    async def run(self):
        # Spawn first enemy
        self.spawn_enemy()
        
        while self.running:
            self.handle_events()
            self.update()
            self.render()
            self.clock.tick(FPS)
            
            # IMPORTANT: Yield control to browser
            await asyncio.sleep(0)
        
        pygame.quit()

async def main():
    game = Game()
    await game.run()

# Start the game
if __name__ == "__main__":
    asyncio.run(main())
`;
  }
}

// Export singleton instance
export const pythonBuilder = new PythonBuilder();

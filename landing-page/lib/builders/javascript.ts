/**
 * JavaScript/HTML5 Canvas Game Builder
 * 
 * Builds games using vanilla JavaScript and HTML5 Canvas.
 * No compilation needed - just bundles HTML with embedded JS/CSS.
 */

import { GameBuilder, BuildResult, TemplateInfo, LanguageInfo } from "./base";
import { GameConfig } from "@/lib/schemas";
import { SubscriptionTier } from "@/lib/db-types";

export class JavaScriptBuilder extends GameBuilder {
  readonly language = "javascript";
  
  readonly languageInfo: LanguageInfo = {
    id: "javascript",
    name: "javascript",
    displayName: "JavaScript (HTML5)",
    description: "Create games with vanilla JavaScript and HTML5 Canvas. Fast builds, runs everywhere.",
    icon: "⚡",
    status: "stable",
    requiredTier: "free",
    features: [
      "Instant builds (no compilation)",
      "Runs in any modern browser",
      "Easy to debug and iterate",
      "Full JavaScript ecosystem access",
      "Responsive and mobile-friendly"
    ],
    limitations: [
      "Manual memory management needed for performance",
      "Limited to browser capabilities",
      "No native mobile builds"
    ],
    estimatedBuildTime: "< 5 seconds",
    supportedPlatforms: ["Web", "Mobile Web"]
  };

  canBuild(config: GameConfig, userTier: SubscriptionTier): boolean {
    return this.canUseLanguage(userTier);
  }

  async build(_gameId: string, code: string, _config: GameConfig): Promise<BuildResult> {
    const startTime = Date.now();

    try {
      // For JavaScript games, the "build" is just validating and preparing the HTML
      const validation = this.validateCode(code);
      
      if (!validation.valid) {
        return {
          success: false,
          error: `Code validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // The code IS the final HTML - no compilation needed
      // The actual upload is handled by the build service
      const buildTime = Date.now() - startTime;

      return {
        success: true,
        bundleSize: new Blob([code]).size,
        buildTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown build error',
      };
    }
  }

  getTemplates(): TemplateInfo[] {
    // These would be loaded from the template files
    return [
      {
        id: "js-platformer",
        name: "Platform Adventure",
        category: "platformer",
        description: "Classic platformer with jumping and obstacles",
        difficulty: "rookie",
        requiredTier: "free",
        language: "javascript",
        codeTemplate: "base-platformer",
      },
      {
        id: "js-shooter",
        name: "Space Shooter",
        category: "shooter",
        description: "Dodge enemies and shoot projectiles",
        difficulty: "rookie",
        requiredTier: "free",
        language: "javascript",
        codeTemplate: "base-shooter",
      },
    ];
  }

  async generateCode(_prompt: string, config: GameConfig): Promise<string> {
    // This would use the existing game generator with JavaScript-specific prompts
    // For now, return a basic template
    return this.getStarterCode(config);
  }

  validateCode(code: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic HTML validation
    if (!code.includes('<!DOCTYPE html>') && !code.includes('<html')) {
      errors.push('Missing HTML document structure');
    }

    if (!code.includes('<canvas') && !code.includes('canvas')) {
      // Warning, not error - might use div-based rendering
      console.warn('No canvas element found - using alternative rendering?');
    }

    // Check for game loop
    if (!code.includes('requestAnimationFrame') && !code.includes('setInterval')) {
      errors.push('No game loop found');
    }

    // Check for basic script tags
    if (!code.includes('<script') && !code.includes('</script>')) {
      errors.push('No JavaScript code found');
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
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game - ${playerName}'s Adventure</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a2e;
            font-family: 'Arial', sans-serif;
            color: white;
        }
        #gameCanvas {
            border: 2px solid #16213e;
            background: #0f3460;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        #gameInfo {
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 18px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <div id="gameInfo">
        <div>Score: <span id="score">0</span></div>
        <div>Lives: <span id="lives">3</span></div>
    </div>

    <script>
        // Game Configuration
        const CONFIG = ${JSON.stringify(_config, null, 2)};
        
        // Canvas Setup
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // Game State
        const game = {
            score: 0,
            lives: 3,
            running: true,
            player: {
                x: 100,
                y: canvas.height - 100,
                width: 40,
                height: 40,
                velocityY: 0,
                speed: 5,
                jumpPower: -12,
                isJumping: false,
                color: '#00d9ff'
            },
            enemies: [],
            keys: {},
            gravity: 0.5
        };
        
        // Input Handling
        document.addEventListener('keydown', (e) => {
            game.keys[e.key] = true;
            
            // Jump
            if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && !game.player.isJumping) {
                game.player.velocityY = game.player.jumpPower;
                game.player.isJumping = true;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            game.keys[e.key] = false;
        });
        
        // Spawn Enemies
        function spawnEnemy() {
            game.enemies.push({
                x: canvas.width,
                y: canvas.height - 100,
                width: 40,
                height: 40,
                speed: 3,
                color: '#ff0055'
            });
        }
        
        // Spawn first enemy and set interval
        spawnEnemy();
        setInterval(spawnEnemy, 2000);
        
        // Update Game Logic
        function update() {
            if (!game.running) return;
            
            // Player Movement
            if (game.keys['ArrowLeft'] || game.keys['a']) {
                game.player.x -= game.player.speed;
            }
            if (game.keys['ArrowRight'] || game.keys['d']) {
                game.player.x += game.player.speed;
            }
            
            // Gravity
            game.player.velocityY += game.gravity;
            game.player.y += game.player.velocityY;
            
            // Ground Collision
            if (game.player.y >= canvas.height - game.player.height - 50) {
                game.player.y = canvas.height - game.player.height - 50;
                game.player.velocityY = 0;
                game.player.isJumping = false;
            }
            
            // Keep player in bounds
            game.player.x = Math.max(0, Math.min(canvas.width - game.player.width, game.player.x));
            
            // Update Enemies
            for (let i = game.enemies.length - 1; i >= 0; i--) {
                const enemy = game.enemies[i];
                enemy.x -= enemy.speed;
                
                // Remove off-screen enemies
                if (enemy.x + enemy.width < 0) {
                    game.enemies.splice(i, 1);
                    game.score += 10;
                    updateUI();
                    continue;
                }
                
                // Collision Detection
                if (checkCollision(game.player, enemy)) {
                    game.lives--;
                    updateUI();
                    game.enemies.splice(i, 1);
                    
                    if (game.lives <= 0) {
                        game.running = false;
                        alert('Game Over! Final Score: ' + game.score);
                        location.reload();
                    }
                }
            }
        }
        
        // Collision Detection
        function checkCollision(rect1, rect2) {
            return rect1.x < rect2.x + rect2.width &&
                   rect1.x + rect1.width > rect2.x &&
                   rect1.y < rect2.y + rect2.height &&
                   rect1.y + rect1.height > rect2.y;
        }
        
        // Render Game
        function render() {
            // Clear Canvas
            ctx.fillStyle = '#0f3460';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw Ground
            ctx.fillStyle = '#16213e';
            ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
            
            // Draw Player
            ctx.fillStyle = game.player.color;
            ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
            
            // Draw Player Name
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('${playerName}', game.player.x + game.player.width / 2, game.player.y - 5);
            
            // Draw Enemies
            game.enemies.forEach(enemy => {
                ctx.fillStyle = enemy.color;
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                ctx.fillStyle = 'white';
                ctx.fillText('${enemyName}', enemy.x + enemy.width / 2, enemy.y - 5);
            });
            
            // Draw Instructions
            if (game.enemies.length === 1) {
                ctx.fillStyle = 'white';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Arrow Keys / WASD to Move, Space to Jump', canvas.width / 2, 50);
            }
        }
        
        // Update UI
        function updateUI() {
            document.getElementById('score').textContent = game.score;
            document.getElementById('lives').textContent = game.lives;
        }
        
        // Game Loop
        function gameLoop() {
            update();
            render();
            requestAnimationFrame(gameLoop);
        }
        
        // Start Game
        gameLoop();
    </script>
</body>
</html>`;
  }
}

// Export singleton instance
export const javascriptBuilder = new JavaScriptBuilder();

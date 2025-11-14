export const basePlatformerCode = `
<!DOCTYPE html>
<html>
<head>
    <title>{{GAME_TITLE}}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: Arial, sans-serif;
        }
        canvas {
            border: 4px solid #fff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            background: #87CEEB;
        }
        #ui {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            z-index: 10;
        }
    </style>
</head>
<body>
    <div id="ui">
        <div>Score: <span id="score">0</span></div>
        <div>Lives: <span id="lives">3</span></div>
    </div>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // Game state
        let score = 0;
        let lives = 3;
        let gameOver = false;
        const difficulty = {{DIFFICULTY_MULTIPLIER}};
        
        // Player ({{PLAYER_NAME}})
        const player = {
            x: 100,
            y: 450,
            width: 40,
            height: 40,
            velocityY: 0,
            velocityX: 0,
            speed: 5 * difficulty,
            jumpPower: -12,
            gravity: 0.5,
            onGround: false,
            color: '{{PLAYER_COLOR}}'
        };
        
        // Platforms
        const platforms = [
            { x: 0, y: 550, width: 800, height: 50 },
            { x: 200, y: 450, width: 150, height: 20 },
            { x: 400, y: 350, width: 150, height: 20 },
            { x: 100, y: 250, width: 150, height: 20 },
            { x: 500, y: 200, width: 150, height: 20 }
        ];
        
        // Enemies ({{ENEMY_NAME}}s)
        const enemies = [];
        function spawnEnemy() {
            enemies.push({
                x: canvas.width,
                y: 500,
                width: 35,
                height: 35,
                speed: 2 * difficulty,
                color: '{{ENEMY_COLOR}}'
            });
        }
        
        // Collectibles
        const coins = [];
        function spawnCoin() {
            const platform = platforms[Math.floor(Math.random() * platforms.length)];
            coins.push({
                x: platform.x + Math.random() * (platform.width - 20),
                y: platform.y - 30,
                width: 20,
                height: 20,
                collected: false
            });
        }
        
        // Spawn initial items
        setInterval(() => {
            if (!gameOver && enemies.length < 3) spawnEnemy();
        }, 3000 / difficulty);
        
        setInterval(() => {
            if (!gameOver && coins.length < 5) spawnCoin();
        }, 2000);
        
        // Input
        const keys = {};
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
            if (e.key === ' ' && player.onGround) {
                player.velocityY = player.jumpPower;
            }
        });
        window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });
        
        // Game loop
        function update() {
            if (gameOver) return;
            
            // Player movement
            if (keys['ArrowLeft'] || keys['a']) {
                player.velocityX = -player.speed;
            } else if (keys['ArrowRight'] || keys['d']) {
                player.velocityX = player.speed;
            } else {
                player.velocityX = 0;
            }
            
            player.x += player.velocityX;
            player.velocityY += player.gravity;
            player.y += player.velocityY;
            
            // Boundary check
            player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
            
            // Platform collision
            player.onGround = false;
            platforms.forEach(platform => {
                if (player.x < platform.x + platform.width &&
                    player.x + player.width > platform.x &&
                    player.y + player.height > platform.y &&
                    player.y + player.height < platform.y + platform.height &&
                    player.velocityY > 0) {
                    player.y = platform.y - player.height;
                    player.velocityY = 0;
                    player.onGround = true;
                }
            });
            
            // Fall death
            if (player.y > canvas.height) {
                lives--;
                document.getElementById('lives').textContent = lives;
                if (lives <= 0) {
                    gameOver = true;
                } else {
                    player.x = 100;
                    player.y = 450;
                    player.velocityY = 0;
                }
            }
            
            // Update enemies
            enemies.forEach((enemy, index) => {
                enemy.x -= enemy.speed;
                
                // Remove off-screen enemies
                if (enemy.x + enemy.width < 0) {
                    enemies.splice(index, 1);
                }
                
                // Collision with player
                if (player.x < enemy.x + enemy.width &&
                    player.x + player.width > enemy.x &&
                    player.y < enemy.y + enemy.height &&
                    player.y + player.height > enemy.y) {
                    lives--;
                    document.getElementById('lives').textContent = lives;
                    enemies.splice(index, 1);
                    if (lives <= 0) {
                        gameOver = true;
                    }
                }
            });
            
            // Update coins
            coins.forEach((coin, index) => {
                if (!coin.collected &&
                    player.x < coin.x + coin.width &&
                    player.x + player.width > coin.x &&
                    player.y < coin.y + coin.height &&
                    player.y + player.height > coin.y) {
                    coin.collected = true;
                    score += 10;
                    document.getElementById('score').textContent = score;
                    coins.splice(index, 1);
                }
            });
        }
        
        function draw() {
            // Clear canvas
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw platforms
            ctx.fillStyle = '#8B4513';
            platforms.forEach(platform => {
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 2;
                ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
            });
            
            // Draw player
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.fillText('{{PLAYER_NAME}}', player.x, player.y - 5);
            
            // Draw enemies
            enemies.forEach(enemy => {
                ctx.fillStyle = enemy.color;
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                ctx.fillStyle = '#fff';
                ctx.font = '10px Arial';
                ctx.fillText('{{ENEMY_NAME}}', enemy.x, enemy.y - 5);
            });
            
            // Draw coins
            coins.forEach(coin => {
                if (!coin.collected) {
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#FFA500';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });
            
            // Game over
            if (gameOver) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#fff';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 50);
                ctx.font = '24px Arial';
                ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2);
                ctx.fillText('Goal: {{GOAL}}', canvas.width / 2, canvas.height / 2 + 40);
                ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 80);
            }
        }
        
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
        
        // Restart
        window.addEventListener('keydown', (e) => {
            if (e.key === 'r' && gameOver) {
                location.reload();
            }
        });
        
        // Start game
        gameLoop();
    </script>
</body>
</html>
`;


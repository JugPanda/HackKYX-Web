export const baseShooterCode = `
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
            background: linear-gradient(135deg, #000000 0%, #434343 100%);
            font-family: Arial, sans-serif;
        }
        canvas {
            border: 4px solid #fff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            background: #000;
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
        <div>Score: <span id="score">0</span> | Lives: <span id="lives">3</span></div>
    </div>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        let score = 0;
        let lives = 3;
        let gameOver = false;
        const difficulty = {{DIFFICULTY_MULTIPLIER}};
        
        // Player ({{PLAYER_NAME}})
        const player = {
            x: canvas.width / 2,
            y: canvas.height - 80,
            width: 50,
            height: 50,
            speed: 6 * difficulty,
            color: '{{PLAYER_COLOR}}'
        };
        
        // Bullets
        const bullets = [];
        function shootBullet() {
            bullets.push({
                x: player.x + player.width / 2 - 2,
                y: player.y,
                width: 4,
                height: 15,
                speed: 8,
                color: '#ffff00'
            });
        }
        
        // Enemies ({{ENEMY_NAME}}s)
        const enemies = [];
        function spawnEnemy() {
            enemies.push({
                x: Math.random() * (canvas.width - 40),
                y: -50,
                width: 40,
                height: 40,
                speed: (1 + Math.random() * 2) * difficulty,
                color: '{{ENEMY_COLOR}}',
                health: 1
            });
        }
        
        setInterval(() => {
            if (!gameOver && enemies.length < 8) spawnEnemy();
        }, 1000 / difficulty);
        
        // Power-ups
        const powerUps = [];
        function spawnPowerUp() {
            if (Math.random() < 0.3) {
                powerUps.push({
                    x: Math.random() * (canvas.width - 30),
                    y: -30,
                    width: 30,
                    height: 30,
                    speed: 2,
                    type: 'health'
                });
            }
        }
        
        setInterval(() => {
            if (!gameOver) spawnPowerUp();
        }, 5000);
        
        // Input
        const keys = {};
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
            if (e.key === ' ' && !gameOver) {
                shootBullet();
            }
        });
        window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });
        
        // Stars background
        const stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                speed: Math.random() * 2 + 1
            });
        }
        
        function update() {
            if (gameOver) return;
            
            // Move stars
            stars.forEach(star => {
                star.y += star.speed;
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }
            });
            
            // Player movement
            if (keys['ArrowLeft'] || keys['a']) {
                player.x -= player.speed;
            }
            if (keys['ArrowRight'] || keys['d']) {
                player.x += player.speed;
            }
            
            player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
            
            // Update bullets
            bullets.forEach((bullet, bIndex) => {
                bullet.y -= bullet.speed;
                
                if (bullet.y < -bullet.height) {
                    bullets.splice(bIndex, 1);
                }
                
                // Check collision with enemies
                enemies.forEach((enemy, eIndex) => {
                    if (bullet.x < enemy.x + enemy.width &&
                        bullet.x + bullet.width > enemy.x &&
                        bullet.y < enemy.y + enemy.height &&
                        bullet.y + bullet.height > enemy.y) {
                        bullets.splice(bIndex, 1);
                        enemy.health--;
                        if (enemy.health <= 0) {
                            enemies.splice(eIndex, 1);
                            score += 10;
                            document.getElementById('score').textContent = score;
                        }
                    }
                });
            });
            
            // Update enemies
            enemies.forEach((enemy, index) => {
                enemy.y += enemy.speed;
                
                if (enemy.y > canvas.height) {
                    enemies.splice(index, 1);
                }
                
                // Collision with player
                if (player.x < enemy.x + enemy.width &&
                    player.x + player.width > enemy.x &&
                    player.y < enemy.y + enemy.height &&
                    player.y + player.height > enemy.y) {
                    enemies.splice(index, 1);
                    lives--;
                    document.getElementById('lives').textContent = lives;
                    if (lives <= 0) {
                        gameOver = true;
                    }
                }
            });
            
            // Update power-ups
            powerUps.forEach((powerUp, index) => {
                powerUp.y += powerUp.speed;
                
                if (powerUp.y > canvas.height) {
                    powerUps.splice(index, 1);
                }
                
                // Collision with player
                if (player.x < powerUp.x + powerUp.width &&
                    player.x + player.width > powerUp.x &&
                    player.y < powerUp.y + powerUp.height &&
                    player.y + player.height > powerUp.y) {
                    powerUps.splice(index, 1);
                    lives = Math.min(5, lives + 1);
                    document.getElementById('lives').textContent = lives;
                }
            });
        }
        
        function draw() {
            // Background
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Stars
            stars.forEach(star => {
                ctx.fillStyle = '#fff';
                ctx.fillRect(star.x, star.y, star.size, star.size);
            });
            
            // Player
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.fillText('{{PLAYER_NAME}}', player.x, player.y - 5);
            
            // Bullets
            bullets.forEach(bullet => {
                ctx.fillStyle = bullet.color;
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });
            
            // Enemies
            enemies.forEach(enemy => {
                ctx.fillStyle = enemy.color;
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            });
            
            // Power-ups
            powerUps.forEach(powerUp => {
                ctx.fillStyle = '#2ecc71';
                ctx.beginPath();
                ctx.arc(powerUp.x + 15, powerUp.y + 15, 15, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('+', powerUp.x + 15, powerUp.y + 22);
            });
            
            if (gameOver) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
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
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'r' && gameOver) {
                location.reload();
            }
        });
        
        gameLoop();
    </script>
</body>
</html>
`;


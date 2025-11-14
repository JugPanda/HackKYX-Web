export const baseAdventureCode = `
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
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            font-family: Arial, sans-serif;
        }
        canvas {
            border: 4px solid #fff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        #ui {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 20px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            z-index: 10;
        }
    </style>
</head>
<body>
    <div id="ui">
        <div>{{PLAYER_NAME}} | Items: <span id="items">0</span>/5 | Goal: {{GOAL}}</div>
    </div>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        const TILE_SIZE = 40;
        const difficulty = {{DIFFICULTY_MULTIPLIER}};
        
        // Player
        const player = {
            x: 1,
            y: 1,
            size: TILE_SIZE - 4,
            speed: 4 * difficulty,
            color: '{{PLAYER_COLOR}}',
            items: 0
        };
        
        // Map (0 = empty, 1 = wall, 2 = item)
        const map = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,2,0,0,0,1],
            [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
            [1,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,0,1],
            [1,0,0,0,0,0,1,0,1,2,0,2,1,0,1,0,0,0,0,1],
            [1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1],
            [1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        // Enemies
        const enemies = [
            { x: 10, y: 5, size: TILE_SIZE - 4, speed: 1.5 * difficulty, color: '{{ENEMY_COLOR}}', dirX: 1, dirY: 0 },
            { x: 5, y: 10, size: TILE_SIZE - 4, speed: 1.5 * difficulty, color: '{{ENEMY_COLOR}}', dirX: 0, dirY: 1 },
            { x: 15, y: 7, size: TILE_SIZE - 4, speed: 1.5 * difficulty, color: '{{ENEMY_COLOR}}', dirX: -1, dirY: 0 }
        ];
        
        // Input
        const keys = {};
        window.addEventListener('keydown', (e) => { keys[e.key] = true; });
        window.addEventListener('keyup', (e) => { keys[e.key] = false; });
        
        function canMove(x, y) {
            const tileX = Math.floor(x / TILE_SIZE);
            const tileY = Math.floor(y / TILE_SIZE);
            const tileX2 = Math.floor((x + player.size) / TILE_SIZE);
            const tileY2 = Math.floor((y + player.size) / TILE_SIZE);
            
            return map[tileY] && map[tileY][tileX] !== 1 &&
                   map[tileY2] && map[tileY2][tileX2] !== 1;
        }
        
        function collectItem(x, y) {
            const tileX = Math.floor(x / TILE_SIZE);
            const tileY = Math.floor(y / TILE_SIZE);
            
            if (map[tileY] && map[tileY][tileX] === 2) {
                map[tileY][tileX] = 0;
                player.items++;
                document.getElementById('items').textContent = player.items;
            }
        }
        
        let gameWon = false;
        let gameLost = false;
        
        function update() {
            if (gameWon || gameLost) return;
            
            // Player movement
            let newX = player.x;
            let newY = player.y;
            
            if (keys['ArrowUp'] || keys['w']) newY -= player.speed;
            if (keys['ArrowDown'] || keys['s']) newY += player.speed;
            if (keys['ArrowLeft'] || keys['a']) newX -= player.speed;
            if (keys['ArrowRight'] || keys['d']) newX += player.speed;
            
            if (canMove(newX, player.y)) player.x = newX;
            if (canMove(player.x, newY)) player.y = newY;
            
            collectItem(player.x + player.size/2, player.y + player.size/2);
            
            // Check win condition
            if (player.items >= 5) {
                gameWon = true;
            }
            
            // Enemy movement
            enemies.forEach(enemy => {
                let newEnemyX = enemy.x + enemy.dirX * enemy.speed;
                let newEnemyY = enemy.y + enemy.dirY * enemy.speed;
                
                if (!canMove(newEnemyX, enemy.y) || !canMove(enemy.x, newEnemyY)) {
                    enemy.dirX *= -1;
                    enemy.dirY *= -1;
                }
                
                if (canMove(newEnemyX, enemy.y)) enemy.x = newEnemyX;
                if (canMove(enemy.x, newEnemyY)) enemy.y = newEnemyY;
                
                // Check collision with player
                if (Math.abs(player.x - enemy.x) < player.size &&
                    Math.abs(player.y - enemy.y) < player.size) {
                    gameLost = true;
                }
            });
        }
        
        function draw() {
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw map
            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    if (map[y][x] === 1) {
                        ctx.fillStyle = '#34495e';
                        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                        ctx.strokeStyle = '#1a252f';
                        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    } else if (map[y][x] === 2) {
                        ctx.fillStyle = '#f39c12';
                        ctx.beginPath();
                        ctx.arc(x * TILE_SIZE + TILE_SIZE/2, y * TILE_SIZE + TILE_SIZE/2, 12, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            
            // Draw player
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.size, player.size);
            
            // Draw enemies
            enemies.forEach(enemy => {
                ctx.fillStyle = enemy.color;
                ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
            });
            
            // Win/lose screens
            if (gameWon) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#2ecc71';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Victory!', canvas.width / 2, canvas.height / 2 - 30);
                ctx.font = '24px Arial';
                ctx.fillStyle = '#fff';
                ctx.fillText('{{GOAL}} Complete!', canvas.width / 2, canvas.height / 2 + 20);
                ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 60);
            }
            
            if (gameLost) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#e74c3c';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
                ctx.font = '24px Arial';
                ctx.fillStyle = '#fff';
                ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 50);
            }
        }
        
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'r' && (gameWon || gameLost)) {
                location.reload();
            }
        });
        
        gameLoop();
    </script>
</body>
</html>
`;


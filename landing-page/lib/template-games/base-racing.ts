export const baseRacingCode = `
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
            background: linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%);
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
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            z-index: 10;
        }
    </style>
</head>
<body>
    <div id="ui">
        <div>Lap: <span id="lap">1</span>/3 | Speed: <span id="speed">0</span> | Time: <span id="time">0</span>s</div>
    </div>
    <canvas id="gameCanvas" width="600" height="800"></canvas>
    
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        const difficulty = {{DIFFICULTY_MULTIPLIER}};
        let gameOver = false;
        let gameWon = false;
        let time = 0;
        let lap = 1;
        
        // Player car ({{PLAYER_NAME}})
        const player = {
            x: canvas.width / 2 - 20,
            y: canvas.height - 120,
            width: 40,
            height: 60,
            speed: 0,
            maxSpeed: 8 * difficulty,
            acceleration: 0.2,
            deceleration: 0.1,
            turnSpeed: 4,
            color: '{{PLAYER_COLOR}}'
        };
        
        // Road
        let roadOffset = 0;
        const roadSpeed = 5;
        
        // Lane markers
        const laneMarkers = [];
        for (let i = 0; i < 20; i++) {
            laneMarkers.push({
                x: canvas.width / 2,
                y: i * 60
            });
        }
        
        // Obstacles ({{ENEMY_NAME}}s - opponent cars)
        const obstacles = [];
        function spawnObstacle() {
            const lane = Math.floor(Math.random() * 3);
            const laneX = canvas.width / 4 + lane * canvas.width / 4;
            obstacles.push({
                x: laneX - 20,
                y: -100,
                width: 40,
                height: 60,
                speed: 3 + Math.random() * 2 * difficulty,
                color: '{{ENEMY_COLOR}}'
            });
        }
        
        setInterval(() => {
            if (!gameOver && !gameWon && obstacles.length < 4) {
                spawnObstacle();
            }
        }, 2000 / difficulty);
        
        // Checkpoints
        let checkpointsPassed = 0;
        const checkpointsPerLap = 3;
        let nextCheckpoint = 0;
        
        const checkpoints = [];
        for (let i = 0; i < checkpointsPerLap; i++) {
            checkpoints.push({
                y: 200,
                passed: false
            });
        }
        
        // Input
        const keys = {};
        window.addEventListener('keydown', (e) => { keys[e.key] = true; });
        window.addEventListener('keyup', (e) => { keys[e.key] = false; });
        
        function update() {
            if (gameOver || gameWon) return;
            
            time += 0.016;
            document.getElementById('time').textContent = Math.floor(time);
            
            // Acceleration
            if (keys['ArrowUp'] || keys['w']) {
                player.speed = Math.min(player.maxSpeed, player.speed + player.acceleration);
            } else {
                player.speed = Math.max(0, player.speed - player.deceleration);
            }
            
            document.getElementById('speed').textContent = Math.floor(player.speed * 10);
            
            // Steering
            if (keys['ArrowLeft'] || keys['a']) {
                player.x -= player.turnSpeed;
            }
            if (keys['ArrowRight'] || keys['d']) {
                player.x += player.turnSpeed;
            }
            
            // Keep on road
            const roadMargin = 80;
            player.x = Math.max(roadMargin, Math.min(canvas.width - roadMargin - player.width, player.x));
            
            // Off-road penalty
            if (player.x < roadMargin + 10 || player.x > canvas.width - roadMargin - player.width - 10) {
                player.speed *= 0.95;
            }
            
            // Road animation
            roadOffset += player.speed;
            if (roadOffset > 60) {
                roadOffset = 0;
                checkpointsPassed++;
                if (checkpointsPassed >= checkpointsPerLap) {
                    lap++;
                    document.getElementById('lap').textContent = lap;
                    checkpointsPassed = 0;
                    if (lap > 3) {
                        gameWon = true;
                    }
                }
            }
            
            // Move lane markers
            laneMarkers.forEach(marker => {
                marker.y += player.speed;
                if (marker.y > canvas.height) {
                    marker.y = -40;
                }
            });
            
            // Update obstacles
            obstacles.forEach((obstacle, index) => {
                obstacle.y += player.speed + obstacle.speed;
                
                if (obstacle.y > canvas.height) {
                    obstacles.splice(index, 1);
                }
                
                // Collision
                if (player.x < obstacle.x + obstacle.width &&
                    player.x + player.width > obstacle.x &&
                    player.y < obstacle.y + obstacle.height &&
                    player.y + player.height > obstacle.y) {
                    gameOver = true;
                }
            });
        }
        
        function draw() {
            // Road
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Grass
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(0, 0, 80, canvas.height);
            ctx.fillRect(canvas.width - 80, 0, 80, canvas.height);
            
            // Road surface
            ctx.fillStyle = '#34495e';
            ctx.fillRect(80, 0, canvas.width - 160, canvas.height);
            
            // Lane markers
            ctx.fillStyle = '#fff';
            laneMarkers.forEach(marker => {
                ctx.fillRect(marker.x - 2, marker.y, 4, 40);
            });
            
            // Player
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
            ctx.fillStyle = '#000';
            ctx.fillRect(player.x + 5, player.y + 5, 10, 10);
            ctx.fillRect(player.x + 25, player.y + 5, 10, 10);
            
            // Obstacles
            obstacles.forEach(obstacle => {
                ctx.fillStyle = obstacle.color;
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                ctx.fillStyle = '#fff';
                ctx.fillRect(obstacle.x + 5, obstacle.y + 45, 10, 10);
                ctx.fillRect(obstacle.x + 25, obstacle.y + 45, 10, 10);
            });
            
            if (gameWon) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#2ecc71';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2 - 50);
                ctx.fillStyle = '#fff';
                ctx.font = '24px Arial';
                ctx.fillText('Time: ' + Math.floor(time) + 's', canvas.width / 2, canvas.height / 2);
                ctx.fillText('Goal: {{GOAL}}', canvas.width / 2, canvas.height / 2 + 40);
                ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 80);
            }
            
            if (gameOver) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#e74c3c';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Crashed!', canvas.width / 2, canvas.height / 2 - 20);
                ctx.fillStyle = '#fff';
                ctx.font = '24px Arial';
                ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 30);
            }
        }
        
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'r' && (gameOver || gameWon)) {
                location.reload();
            }
        });
        
        gameLoop();
    </script>
</body>
</html>
`;


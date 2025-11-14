export const baseArcadeCode = `
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
            background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%);
            font-family: Arial, sans-serif;
        }
        canvas {
            border: 4px solid #fff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            background: #1a1a2e;
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
        <div>Score: <span id="score">0</span> | High: <span id="high">0</span></div>
    </div>
    <canvas id="gameCanvas" width="400" height="600"></canvas>
    
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        let score = 0;
        let highScore = 0;
        let gameOver = false;
        const difficulty = {{DIFFICULTY_MULTIPLIER}};
        
        // Player ({{PLAYER_NAME}})
        const player = {
            x: canvas.width / 2 - 25,
            y: canvas.height - 100,
            width: 50,
            height: 20,
            speed: 8 * difficulty,
            color: '{{PLAYER_COLOR}}'
        };
        
        // Ball
        const ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 8,
            velocityX: 3 * difficulty,
            velocityY: -3 * difficulty,
            color: '#ffff00',
            speed: 3 * difficulty
        };
        
        // Bricks ({{ENEMY_NAME}}s)
        const brickRows = Math.floor(5 * difficulty);
        const brickCols = 8;
        const brickWidth = 45;
        const brickHeight = 20;
        const brickPadding = 5;
        const brickOffsetTop = 60;
        const brickOffsetLeft = 5;
        
        const bricks = [];
        for (let row = 0; row < brickRows; row++) {
            bricks[row] = [];
            for (let col = 0; col < brickCols; col++) {
                bricks[row][col] = {
                    x: col * (brickWidth + brickPadding) + brickOffsetLeft,
                    y: row * (brickHeight + brickPadding) + brickOffsetTop,
                    width: brickWidth,
                    height: brickHeight,
                    active: true,
                    color: '{{ENEMY_COLOR}}'
                };
            }
        }
        
        // Input
        const keys = {};
        window.addEventListener('keydown', (e) => { keys[e.key] = true; });
        window.addEventListener('keyup', (e) => { keys[e.key] = false; });
        
        function update() {
            if (gameOver) return;
            
            // Player movement
            if (keys['ArrowLeft'] || keys['a']) {
                player.x -= player.speed;
            }
            if (keys['ArrowRight'] || keys['d']) {
                player.x += player.speed;
            }
            
            player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
            
            // Ball movement
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            
            // Wall collision
            if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
                ball.velocityX *= -1;
            }
            if (ball.y - ball.radius < 0) {
                ball.velocityY *= -1;
            }
            
            // Paddle collision
            if (ball.y + ball.radius > player.y &&
                ball.x > player.x &&
                ball.x < player.x + player.width) {
                ball.velocityY *= -1;
                // Add spin based on where ball hits paddle
                const hitPos = (ball.x - player.x) / player.width;
                ball.velocityX = (hitPos - 0.5) * 8 * difficulty;
            }
            
            // Bottom wall (death)
            if (ball.y + ball.radius > canvas.height) {
                gameOver = true;
                if (score > highScore) {
                    highScore = score;
                    document.getElementById('high').textContent = highScore;
                }
            }
            
            // Brick collision
            for (let row = 0; row < brickRows; row++) {
                for (let col = 0; col < brickCols; col++) {
                    const brick = bricks[row][col];
                    if (brick.active) {
                        if (ball.x > brick.x &&
                            ball.x < brick.x + brick.width &&
                            ball.y > brick.y &&
                            ball.y < brick.y + brick.height) {
                            ball.velocityY *= -1;
                            brick.active = false;
                            score += 10;
                            document.getElementById('score').textContent = score;
                        }
                    }
                }
            }
            
            // Check win
            let allBroken = true;
            for (let row = 0; row < brickRows; row++) {
                for (let col = 0; col < brickCols; col++) {
                    if (bricks[row][col].active) {
                        allBroken = false;
                        break;
                    }
                }
            }
            if (allBroken) {
                gameOver = true;
            }
        }
        
        function draw() {
            // Background
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Player
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
            
            // Ball
            ctx.fillStyle = ball.color;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Bricks
            for (let row = 0; row < brickRows; row++) {
                for (let col = 0; col < brickCols; col++) {
                    const brick = bricks[row][col];
                    if (brick.active) {
                        ctx.fillStyle = brick.color;
                        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                        ctx.strokeStyle = '#fff';
                        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
                    }
                }
            }
            
            if (gameOver) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                let allBroken = true;
                for (let row = 0; row < brickRows; row++) {
                    for (let col = 0; col < brickCols; col++) {
                        if (bricks[row][col].active) {
                            allBroken = false;
                            break;
                        }
                    }
                }
                
                ctx.fillStyle = allBroken ? '#2ecc71' : '#e74c3c';
                ctx.font = '36px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(allBroken ? 'You Win!' : 'Game Over', canvas.width / 2, canvas.height / 2 - 40);
                ctx.fillStyle = '#fff';
                ctx.font = '20px Arial';
                ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2);
                ctx.fillText('Goal: {{GOAL}}', canvas.width / 2, canvas.height / 2 + 30);
                ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 60);
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


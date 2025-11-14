export const baseRPGCode = `
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
            background: linear-gradient(135deg, #4a148c 0%, #880e4f 100%);
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
            font-size: 18px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            z-index: 10;
            text-align: center;
        }
    </style>
</head>
<body>
    <div id="ui">
        <div>{{PLAYER_NAME}} | HP: <span id="hp">100</span>/100 | XP: <span id="xp">0</span> | Level: <span id="level">1</span></div>
    </div>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        const difficulty = {{DIFFICULTY_MULTIPLIER}};
        let gameState = 'explore'; // explore, battle, win
        
        // Player
        const player = {
            name: '{{PLAYER_NAME}}',
            hp: 100,
            maxHp: 100,
            xp: 0,
            level: 1,
            attack: 10 * difficulty,
            defense: 5,
            x: 400,
            y: 300,
            size: 30,
            color: '{{PLAYER_COLOR}}'
        };
        
        // Current enemy
        let currentEnemy = null;
        const enemyTypes = [
            { name: '{{ENEMY_NAME}}', hp: 30, attack: 8, xp: 20, color: '{{ENEMY_COLOR}}' },
            { name: 'Strong ' + '{{ENEMY_NAME}}', hp: 50, attack: 12, xp: 40, color: '#c0392b' },
            { name: 'Boss ' + '{{ENEMY_NAME}}', hp: 100, attack: 15, xp: 100, color: '#8e44ad' }
        ];
        
        let battleLog = [];
        let battleTurn = 'player';
        
        function spawnEnemy() {
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            currentEnemy = {
                name: type.name,
                hp: type.hp * difficulty,
                maxHp: type.hp * difficulty,
                attack: type.attack * difficulty,
                xp: type.xp,
                color: type.color
            };
            gameState = 'battle';
            battleLog = [\`A wild \${currentEnemy.name} appears!\`];
            battleTurn = 'player';
        }
        
        function playerAttack() {
            if (battleTurn !== 'player' || !currentEnemy) return;
            
            const damage = Math.max(1, player.attack - Math.random() * 5);
            currentEnemy.hp -= damage;
            battleLog.push(\`You deal \${Math.floor(damage)} damage!\`);
            
            if (currentEnemy.hp <= 0) {
                battleLog.push(\`\${currentEnemy.name} defeated!\`);
                player.xp += currentEnemy.xp;
                document.getElementById('xp').textContent = player.xp;
                
                // Level up
                const xpNeeded = player.level * 50;
                if (player.xp >= xpNeeded) {
                    player.level++;
                    player.maxHp += 20;
                    player.hp = player.maxHp;
                    player.attack += 5;
                    battleLog.push(\`Level up! Now level \${player.level}!\`);
                    document.getElementById('level').textContent = player.level;
                    document.getElementById('hp').textContent = player.hp;
                }
                
                setTimeout(() => {
                    currentEnemy = null;
                    gameState = 'explore';
                    battleLog = [];
                }, 2000);
            } else {
                battleTurn = 'enemy';
                setTimeout(enemyAttack, 1000);
            }
        }
        
        function enemyAttack() {
            if (!currentEnemy || currentEnemy.hp <= 0) return;
            
            const damage = Math.max(1, currentEnemy.attack - player.defense - Math.random() * 3);
            player.hp -= damage;
            player.hp = Math.max(0, player.hp);
            document.getElementById('hp').textContent = Math.floor(player.hp);
            battleLog.push(\`\${currentEnemy.name} deals \${Math.floor(damage)} damage!\`);
            
            if (player.hp <= 0) {
                battleLog.push('You were defeated!');
                gameState = 'gameover';
            } else {
                battleTurn = 'player';
            }
        }
        
        // Keys
        const keys = {};
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
            
            if (gameState === 'battle' && e.key === ' ' && battleTurn === 'player') {
                playerAttack();
            }
            
            if (gameState === 'gameover' && e.key === 'r') {
                location.reload();
            }
        });
        window.addEventListener('keyup', (e) => { keys[e.key] = false; });
        
        // Random encounters
        let encounterTimer = 0;
        
        function update() {
            if (gameState === 'explore') {
                // Move player
                if (keys['ArrowUp'] || keys['w']) player.y -= 3;
                if (keys['ArrowDown'] || keys['s']) player.y += 3;
                if (keys['ArrowLeft'] || keys['a']) player.x -= 3;
                if (keys['ArrowRight'] || keys['d']) player.x += 3;
                
                player.x = Math.max(30, Math.min(canvas.width - 30, player.x));
                player.y = Math.max(30, Math.min(canvas.height - 30, player.y));
                
                // Random encounters
                encounterTimer++;
                if (encounterTimer > 180 / difficulty) {
                    if (Math.random() < 0.3) {
                        spawnEnemy();
                    }
                    encounterTimer = 0;
                }
            }
        }
        
        function draw() {
            if (gameState === 'explore') {
                // Draw exploration view
                ctx.fillStyle = '#1a5f3e';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Grid
                ctx.strokeStyle = '#145a32';
                for (let x = 0; x < canvas.width; x += 40) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }
                for (let y = 0; y < canvas.height; y += 40) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }
                
                // Player
                ctx.fillStyle = player.color;
                ctx.fillRect(player.x - 15, player.y - 15, player.size, player.size);
                ctx.fillStyle = '#fff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(player.name, player.x, player.y - 20);
                
                ctx.fillStyle = '#fff';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Move with WASD or Arrow Keys', canvas.width / 2, canvas.height - 20);
                ctx.fillText('Goal: {{GOAL}}', canvas.width / 2, 30);
                
            } else if (gameState === 'battle' && currentEnemy) {
                // Draw battle view
                ctx.fillStyle = '#2c3e50';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Player side
                ctx.fillStyle = player.color;
                ctx.fillRect(150, 350, 80, 80);
                ctx.fillStyle = '#fff';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(player.name, 190, 340);
                ctx.fillText(\`HP: \${Math.floor(player.hp)}/\${player.maxHp}\`, 190, 445);
                
                // HP bar (player)
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(150, 450, 80, 10);
                ctx.fillStyle = '#2ecc71';
                ctx.fillRect(150, 450, 80 * (player.hp / player.maxHp), 10);
                
                // Enemy side
                ctx.fillStyle = currentEnemy.color;
                ctx.fillRect(570, 150, 80, 80);
                ctx.fillStyle = '#fff';
                ctx.fillText(currentEnemy.name, 610, 140);
                ctx.fillText(\`HP: \${Math.floor(currentEnemy.hp)}/\${currentEnemy.maxHp}\`, 610, 245);
                
                // HP bar (enemy)
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(570, 250, 80, 10);
                ctx.fillStyle = '#2ecc71';
                ctx.fillRect(570, 250, 80 * (currentEnemy.hp / currentEnemy.maxHp), 10);
                
                // Battle log
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(50, 480, 700, 100);
                ctx.fillStyle = '#fff';
                ctx.font = '16px Arial';
                ctx.textAlign = 'left';
                battleLog.slice(-4).forEach((msg, i) => {
                    ctx.fillText(msg, 60, 505 + i * 22);
                });
                
                // Action prompt
                if (battleTurn === 'player') {
                    ctx.textAlign = 'center';
                    ctx.fillText('Press SPACE to Attack!', canvas.width / 2, 50);
                }
                
            } else if (gameState === 'gameover') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#e74c3c';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);
                ctx.fillStyle = '#fff';
                ctx.font = '24px Arial';
                ctx.fillText(\`Level \${player.level} - XP \${player.xp}\`, canvas.width / 2, canvas.height / 2 + 10);
                ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 50);
            }
        }
        
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
        
        gameLoop();
    </script>
</body>
</html>
`;


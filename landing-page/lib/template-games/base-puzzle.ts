export const basePuzzleCode = `
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
            background: linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%);
            font-family: Arial, sans-serif;
        }
        canvas {
            border: 4px solid #fff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            cursor: pointer;
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
        <div>Moves: <span id="moves">0</span> | Goal: {{GOAL}}</div>
    </div>
    <canvas id="gameCanvas" width="600" height="600"></canvas>
    
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        const GRID_SIZE = {{GRID_SIZE}};
        const TILE_SIZE = canvas.width / GRID_SIZE;
        const difficulty = {{DIFFICULTY_MULTIPLIER}};
        
        let moves = 0;
        let gameWon = false;
        
        // Colors for matching
        const colors = ['{{PLAYER_COLOR}}', '{{ENEMY_COLOR}}', '#2ecc71', '#f39c12', '#9b59b6', '#e74c3c'];
        
        // Create grid
        let grid = [];
        function initGrid() {
            grid = [];
            for (let y = 0; y < GRID_SIZE; y++) {
                grid[y] = [];
                for (let x = 0; x < GRID_SIZE; x++) {
                    grid[y][x] = colors[Math.floor(Math.random() * colors.length)];
                }
            }
        }
        
        let selectedTile = null;
        
        canvas.addEventListener('click', (e) => {
            if (gameWon) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
            const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
            
            if (!selectedTile) {
                selectedTile = { x, y };
            } else {
                // Check if adjacent
                const dx = Math.abs(selectedTile.x - x);
                const dy = Math.abs(selectedTile.y - y);
                
                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                    // Swap tiles
                    const temp = grid[y][x];
                    grid[y][x] = grid[selectedTile.y][selectedTile.x];
                    grid[selectedTile.y][selectedTile.x] = temp;
                    
                    moves++;
                    document.getElementById('moves').textContent = moves;
                    
                    // Check for matches
                    checkMatches();
                }
                
                selectedTile = null;
            }
        });
        
        function checkMatches() {
            let matched = [];
            
            // Check horizontal matches
            for (let y = 0; y < GRID_SIZE; y++) {
                for (let x = 0; x < GRID_SIZE - 2; x++) {
                    if (grid[y][x] === grid[y][x+1] && grid[y][x] === grid[y][x+2]) {
                        matched.push({x, y}, {x: x+1, y}, {x: x+2, y});
                    }
                }
            }
            
            // Check vertical matches
            for (let x = 0; x < GRID_SIZE; x++) {
                for (let y = 0; y < GRID_SIZE - 2; y++) {
                    if (grid[y][x] === grid[y+1][x] && grid[y][x] === grid[y+2][x]) {
                        matched.push({x, y}, {x, y: y+1}, {x, y: y+2});
                    }
                }
            }
            
            if (matched.length > 0) {
                // Remove duplicates and clear matched tiles
                const uniqueMatched = matched.filter((v, i, a) => 
                    a.findIndex(t => t.x === v.x && t.y === v.y) === i
                );
                
                uniqueMatched.forEach(tile => {
                    grid[tile.y][tile.x] = null;
                });
                
                // Drop tiles
                setTimeout(() => {
                    dropTiles();
                    fillEmpty();
                    
                    // Check win condition (optional: all same color or score-based)
                    if (moves >= 50 / difficulty) {
                        gameWon = true;
                    }
                }, 200);
            }
        }
        
        function dropTiles() {
            for (let x = 0; x < GRID_SIZE; x++) {
                for (let y = GRID_SIZE - 1; y >= 0; y--) {
                    if (grid[y][x] === null) {
                        // Find tile above
                        for (let y2 = y - 1; y2 >= 0; y2--) {
                            if (grid[y2][x] !== null) {
                                grid[y][x] = grid[y2][x];
                                grid[y2][x] = null;
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        function fillEmpty() {
            for (let y = 0; y < GRID_SIZE; y++) {
                for (let x = 0; x < GRID_SIZE; x++) {
                    if (grid[y][x] === null) {
                        grid[y][x] = colors[Math.floor(Math.random() * colors.length)];
                    }
                }
            }
        }
        
        function draw() {
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid
            for (let y = 0; y < GRID_SIZE; y++) {
                for (let x = 0; x < GRID_SIZE; x++) {
                    if (grid[y][x]) {
                        ctx.fillStyle = grid[y][x];
                        ctx.fillRect(
                            x * TILE_SIZE + 2,
                            y * TILE_SIZE + 2,
                            TILE_SIZE - 4,
                            TILE_SIZE - 4
                        );
                        
                        // Highlight selected
                        if (selectedTile && selectedTile.x === x && selectedTile.y === y) {
                            ctx.strokeStyle = '#fff';
                            ctx.lineWidth = 4;
                            ctx.strokeRect(
                                x * TILE_SIZE + 2,
                                y * TILE_SIZE + 2,
                                TILE_SIZE - 4,
                                TILE_SIZE - 4
                            );
                        }
                    }
                }
            }
            
            if (gameWon) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#2ecc71';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Puzzle Solved!', canvas.width / 2, canvas.height / 2 - 30);
                ctx.font = '24px Arial';
                ctx.fillStyle = '#fff';
                ctx.fillText('Moves: ' + moves, canvas.width / 2, canvas.height / 2 + 20);
                ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 60);
            }
        }
        
        function gameLoop() {
            draw();
            requestAnimationFrame(gameLoop);
        }
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'r' && gameWon) {
                moves = 0;
                gameWon = false;
                document.getElementById('moves').textContent = moves;
                initGrid();
            }
        });
        
        initGrid();
        gameLoop();
    </script>
</body>
</html>
`;


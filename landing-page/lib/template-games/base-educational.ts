export const baseEducationalCode = `
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
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
        <div>Score: <span id="score">0</span> | Streak: <span id="streak">0</span></div>
    </div>
    <canvas id="gameCanvas" width="700" height="600"></canvas>
    
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        let score = 0;
        let streak = 0;
        let gameOver = false;
        const difficulty = {{DIFFICULTY_MULTIPLIER}};
        
        // Quiz questions (math-based for this template)
        const questionTypes = [
            { type: 'add', gen: () => {
                const a = Math.floor(Math.random() * (20 * difficulty) + 1);
                const b = Math.floor(Math.random() * (20 * difficulty) + 1);
                return { q: \`\${a} + \${b}\`, a: a + b };
            }},
            { type: 'subtract', gen: () => {
                const a = Math.floor(Math.random() * (30 * difficulty) + 10);
                const b = Math.floor(Math.random() * a);
                return { q: \`\${a} - \${b}\`, a: a - b };
            }},
            { type: 'multiply', gen: () => {
                const a = Math.floor(Math.random() * (10 * difficulty) + 1);
                const b = Math.floor(Math.random() * (10 * difficulty) + 1);
                return { q: \`\${a} × \${b}\`, a: a * b };
            }}
        ];
        
        let currentQuestion = null;
        let choices = [];
        let selectedChoice = 0;
        let feedback = '';
        let feedbackTimer = 0;
        
        function generateQuestion() {
            const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            const qData = type.gen();
            currentQuestion = { question: qData.q, answer: qData.a };
            
            // Generate choices
            choices = [qData.a];
            while (choices.length < 4) {
                const wrongAnswer = qData.a + Math.floor(Math.random() * 20 - 10);
                if (wrongAnswer !== qData.a && wrongAnswer > 0 && !choices.includes(wrongAnswer)) {
                    choices.push(wrongAnswer);
                }
            }
            
            // Shuffle
            choices.sort(() => Math.random() - 0.5);
            selectedChoice = 0;
        }
        
        // Input
        const keys = {};
        window.addEventListener('keydown', (e) => {
            if (gameOver && e.key === 'r') {
                location.reload();
                return;
            }
            
            if (feedbackTimer > 0) return;
            
            keys[e.key] = true;
            
            if (e.key === 'ArrowUp' || e.key === 'w') {
                selectedChoice = (selectedChoice - 1 + 4) % 4;
            }
            if (e.key === 'ArrowDown' || e.key === 's') {
                selectedChoice = (selectedChoice + 1) % 4;
            }
            if (e.key === ' ' || e.key === 'Enter') {
                checkAnswer();
            }
        });
        
        function checkAnswer() {
            if (!currentQuestion) return;
            
            if (choices[selectedChoice] === currentQuestion.answer) {
                feedback = 'Correct! +10 points';
                score += 10 + streak * 2;
                streak++;
                document.getElementById('score').textContent = score;
                document.getElementById('streak').textContent = streak;
            } else {
                feedback = \`Wrong! The answer was \${currentQuestion.answer}\`;
                streak = 0;
                document.getElementById('streak').textContent = streak;
            }
            
            feedbackTimer = 120; // 2 seconds
        }
        
        function update() {
            if (gameOver) return;
            
            if (feedbackTimer > 0) {
                feedbackTimer--;
                if (feedbackTimer === 0) {
                    generateQuestion();
                    feedback = '';
                }
            }
        }
        
        function draw() {
            // Background
            ctx.fillStyle = '#ecf0f1';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            if (!currentQuestion && feedbackTimer === 0) {
                generateQuestion();
            }
            
            if (currentQuestion) {
                // Question area
                ctx.fillStyle = '{{PLAYER_COLOR}}';
                ctx.fillRect(50, 80, canvas.width - 100, 120);
                ctx.fillStyle = '#fff';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(currentQuestion.question, canvas.width / 2, 160);
                
                // Choices
                choices.forEach((choice, i) => {
                    const y = 240 + i * 80;
                    
                    if (i === selectedChoice) {
                        ctx.fillStyle = '{{ENEMY_COLOR}}';
                    } else {
                        ctx.fillStyle = '#bdc3c7';
                    }
                    
                    ctx.fillRect(100, y, canvas.width - 200, 60);
                    
                    ctx.fillStyle = '#fff';
                    ctx.font = '32px Arial';
                    ctx.fillText(choice.toString(), canvas.width / 2, y + 42);
                });
                
                // Instructions
                ctx.fillStyle = '#34495e';
                ctx.font = '18px Arial';
                ctx.fillText('Use ↑↓ or WS to select, SPACE/ENTER to answer', canvas.width / 2, canvas.height - 40);
                ctx.fillText('Goal: {{GOAL}}', canvas.width / 2, 50);
            }
            
            // Feedback
            if (feedback && feedbackTimer > 0) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                const isCorrect = feedback.includes('Correct');
                ctx.fillStyle = isCorrect ? '#2ecc71' : '#e74c3c';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(feedback.split('!')[0] + '!', canvas.width / 2, canvas.height / 2);
                
                if (!isCorrect) {
                    ctx.fillStyle = '#fff';
                    ctx.font = '32px Arial';
                    ctx.fillText(feedback.split('!')[1], canvas.width / 2, canvas.height / 2 + 50);
                }
            }
            
            // Win condition
            if (score >= 100) {
                gameOver = true;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#2ecc71';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Congratulations!', canvas.width / 2, canvas.height / 2 - 50);
                ctx.fillStyle = '#fff';
                ctx.font = '28px Arial';
                ctx.fillText(\`Final Score: \${score}\`, canvas.width / 2, canvas.height / 2 + 10);
                ctx.fillText('You completed the learning challenge!', canvas.width / 2, canvas.height / 2 + 50);
                ctx.font = '20px Arial';
                ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 90);
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


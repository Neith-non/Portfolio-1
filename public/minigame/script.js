const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Load Images ---
const catImg = new Image();
catImg.src = '/minigame/cat.gif'; // Ensure this path is correct for your setup

// --- Game Constants (Base values tuned for ~900px height) ---
const BASE_HEIGHT = 900;
let scaleRatio = 1;

// --- Handle Window Resizing & Scaling ---
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Calculate scale based on height
    scaleRatio = canvas.height / BASE_HEIGHT;
}
window.addEventListener('resize', resize);
resize(); // Initial call

// Game Variables
let frames = 0;
const DEGREE = Math.PI / 180;
let gameState = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
};

let score = {
    value: 0,
    best: 0,
    draw: function() {
        ctx.save();
        // Scale font size
        ctx.font = `${50 * scaleRatio}px Teko`; // Or your preferred font
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2 * scaleRatio;

        if (gameState.current == gameState.game) {
            ctx.fillText(this.value, canvas.width / 2, 50 * scaleRatio + 30);
            ctx.strokeText(this.value, canvas.width / 2, 50 * scaleRatio + 30);
        } else if (gameState.current == gameState.over) {
            // Score is handled by HTML UI usually, but if drawn:
            let text = `Score: ${this.value} | Best: ${this.best}`;
            ctx.font = `${30 * scaleRatio}px Teko`;
            // document.getElementById('score').innerText... (You are using HTML UI, so this is backup)
            document.getElementById('score').innerText = text;
        }
        ctx.restore();
    }
};

// --- Controls (Mouse & Touch) ---
function initInput() {
    // Keyboard
    document.addEventListener('keydown', function(evt) {
        if (evt.code === 'Space') action();
    });

    // Mouse
    canvas.addEventListener('mousedown', action);

    // Touch (Mobile) - 'touchstart' is more responsive than 'click'
    canvas.addEventListener('touchstart', function(evt) {
        evt.preventDefault(); // Stop double-tap zoom
        action();
    }, {passive: false});

    // Restart Button
    document.getElementById('restart-btn').addEventListener('click', resetGame);
    
    // Quit/Back Button (FIXED: Wrapped in function)
    document.getElementById('back-port').addEventListener('click', function() {
        window.location.href = '/index';
    });
}
initInput();

function action() {
    switch (gameState.current) {
        case gameState.getReady:
            gameState.current = gameState.game;
            document.getElementById('start-message').classList.add('hidden');
            document.getElementById('back-port').classList.add('hidden');
            break;
        case gameState.game:
            catloon.flap();
            break;
    }
}

function resetGame() {
    catloon.speed = 0;
    catloon.rotation = 0;
    
    // Reset positions
    catloon.y = canvas.height / 2;
    catloon.x = canvas.width / 4; // Responsive X position
    
    // Reset Pipes and Speed
    pipes.position = [];
    pipes.dx = 1.5 * scaleRatio; 
    
    score.value = 0;
    frames = 0;
    gameState.current = gameState.getReady;
    document.getElementById('restart-btn').classList.add('hidden');
    document.getElementById('back-port').classList.remove('hidden');
    document.getElementById('start-message').classList.remove('hidden');
    document.getElementById('score').innerText = 0;
    
    resize(); // Ensure scale is correct on reset
    loop();
}

// Objects
const catloon = {
    // Base dimensions (will be multiplied by scaleRatio during draw/update)
    baseWidth: 100,
    baseHeight: 100,
    baseRadius: 34,
    
    // Physics Base Values
    baseGravity: 0.02,
    baseJump: 1.5,
    
    x: 50,
    y: 150,
    speed: 0,
    rotation: 0, 
    
    draw: function() {
        // Calculate scaled dimensions for drawing
        let w = this.baseWidth * scaleRatio;
        let h = this.baseHeight * scaleRatio;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.drawImage(catImg, -w/2, -h/2, w, h);

        ctx.restore();
    },
    
    update: function() {
        // Scaled Physics
        let gravity = this.baseGravity * scaleRatio;
        let h = this.baseHeight * scaleRatio;

        if (gameState.current == gameState.getReady) {
            this.y = (canvas.height / 2) + Math.cos(frames/25) * (10 * scaleRatio);
            this.x = canvas.width / 4;
        } else {
            this.speed += gravity;
            this.y += this.speed;

            // Floor Collision
            if (this.y + h/2 >= canvas.height - 20) {
                this.y = canvas.height - 20 - h/2;
                gameOver();
            }
        }
    },
    
    flap: function() {
        // Scaled Jump
        let jump = this.baseJump * scaleRatio;
        this.speed = -jump;
    }
};

const pipes = {
    position: [],
    
    // Base Values
    baseW: 60,
    baseGap: 200, 
    baseDx: 1.5,
    baseSpacing: 450,
    
    // Dynamic values (set in update)
    dx: 0,
    
    draw: function() {
        let w = this.baseW * scaleRatio;
        let gap = this.baseGap * scaleRatio;

        for(let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            
            ctx.fillStyle = "#2ecc71";
            
            // Top Pipe
            ctx.fillRect(p.x, 0, w, p.y); 
            
            // Bottom Pipe
            ctx.fillRect(p.x, p.y + gap, w, canvas.height); 
        }
    },
    
    update: function() {
        if(gameState.current !== gameState.game) return;

        // Scale values
        let w = this.baseW * scaleRatio;
        let gap = this.baseGap * scaleRatio;
        let spacing = this.baseSpacing * scaleRatio;
        
        // Ensure dx is initialized/scaled
        // We only reset dx if it's 0 to preserve the "speed up" mechanic
        if (this.dx === 0) this.dx = this.baseDx * scaleRatio;

        // Add new pipe
        if (this.position.length === 0 || canvas.width - this.position[this.position.length - 1].x >= spacing) {
             this.position.push({
                x: canvas.width,
                // Random Y position scaled
                y: Math.max(50 * scaleRatio, Math.random() * (canvas.height - (150 * scaleRatio) - gap))
            });
        }
        
        for(let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            
            p.x -= this.dx;
            
            // Remove pipe
            if(p.x + w <= 0) {
                this.position.shift();
                score.value += 1;
                
                // Speed up (Scaled)
                let maxSpeed = 6 * scaleRatio;
                if(this.dx < maxSpeed) {
                    this.dx += (0.1 * scaleRatio);
                }

                score.best = Math.max(score.value, score.best);
                document.getElementById('score').innerText = score.value;
                i--;
                continue;
            }
            
            // Collision Detection
            let r = catloon.baseRadius * scaleRatio; // Scaled Radius
            let catLeft = catloon.x - r;
            let catRight = catloon.x + r;
            let catTop = catloon.y - r;
            let catBottom = catloon.y + r;
            
            let pipeLeft = p.x;
            let pipeRight = p.x + w;
            let topPipeBottom = p.y;
            let bottomPipeTop = p.y + gap;

            if (catRight > pipeLeft && catLeft < pipeRight) {
                if (catTop < topPipeBottom || catBottom > bottomPipeTop) {
                    gameOver();
                }
            }
        }
    }
};

function gameOver() {
    gameState.current = gameState.over;
    document.getElementById('restart-btn').classList.remove('hidden');
    document.getElementById('back-port').classList.remove('hidden');
}

function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    pipes.draw();
    
    ctx.fillStyle = "#ded895";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    catloon.draw();
    // HTML handles score text mostly, but this keeps the object consistent
    // score.draw(); 
}

function update() {
    catloon.update();
    pipes.update();
}

function loop() {
    update();
    draw();
    frames++;
    
    if(gameState.current !== gameState.over) {
        requestAnimationFrame(loop);
    }
}

resetGame();
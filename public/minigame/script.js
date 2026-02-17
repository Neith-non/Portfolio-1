const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Load Images ---
const catImg = new Image();
catImg.src = '/minigame/cat.gif'; 

// --- Handle Window Resizing ---
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

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
        if (gameState.current == gameState.game) {
            document.getElementById('score').innerText = this.value;
        } else if (gameState.current == gameState.over) {
            document.getElementById('score').innerText = `Score: ${this.value} | Best: ${this.best}`;
        }
    }
};

// Controls
document.addEventListener('keydown', function(evt) {
    if (evt.code === 'Space') {
        action();
    }
});
canvas.addEventListener('click', action);
document.getElementById('restart-btn').addEventListener('click', resetGame);

document.getElementById('back-port').addEventListener('click', function() {
    window.location.href = '/';
});

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
    catloon.x = canvas.width / 4;
    
    // Reset Pipes and Speed
    pipes.position = [];
    pipes.dx = 1.5; 
    
    score.value = 0;
    frames = 0;
    gameState.current = gameState.getReady;
    document.getElementById('restart-btn').classList.add('hidden');
    document.getElementById('back-port').classList.remove('hidden');
    document.getElementById('start-message').classList.remove('hidden');
    document.getElementById('back-port').classList.remove('hidden');
    document.getElementById('score').innerText = 0;
    
    resize();
    loop();
}

// Objects
const catloon = {
    x: 50,
    y: 150,
    width: 100,   // Increased size slightly for the image
    height: 100,  // Increased size slightly for the image
    radius: 34,  // Adjusted Hitbox radius
    
    // --- PHYSICS SETTINGS (LOCKED) ---
    gravity: 0.02,  
    jump: 1.5,      
    // ---------------------------------
    
    speed: 100,
    rotation: 0, 
    
    draw: function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.drawImage(catImg, -this.width/2, -this.height/2, this.width, this.height);

        ctx.restore();
    },
    
    update: function() {
        if (gameState.current == gameState.getReady) {
            this.y = (canvas.height / 2) + Math.cos(frames/25) * 10;
            this.x = canvas.width / 4;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.y + this.height/2 >= canvas.height - 20) {
                this.y = canvas.height - 20 - this.height/2;
                gameOver();
            }
        }
    },
    
    flap: function() {
        this.speed = -this.jump;
    }
};

const pipes = {
    position: [],
    w: 60,
    h: 400,
    
    // --- DIFFICULTY SETTINGS ---
    gap: 200,       
    dx: 1.5,        
    spacing: 450,   
    // ---------------------------
    
    draw: function() {
        for(let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            
            ctx.fillStyle = "#2ecc71";
            
            ctx.fillRect(p.x, 0, this.w, p.y); 
            
            ctx.fillRect(p.x, p.y + this.gap, this.w, canvas.height); 
        }
    },
    
    update: function() {
        if(gameState.current !== gameState.game) return;
        
        if (this.position.length === 0 || canvas.width - this.position[this.position.length - 1].x >= this.spacing) {
             this.position.push({
                x: canvas.width,
                y: Math.max(50, Math.random() * (canvas.height - 150 - this.gap))
            });
        }
        
        for(let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            
            p.x -= this.dx;
            
            if(p.x + this.w <= 0) {
                this.position.shift();
                score.value += 1;
                
                if(this.dx < 6) {
                    this.dx += 0.1;
                }

                score.best = Math.max(score.value, score.best);
                document.getElementById('score').innerText = score.value;
                i--;
                continue;
            }
            
            // Collision Detection
            let catLeft = catloon.x - catloon.radius;
            let catRight = catloon.x + catloon.radius;
            let catTop = catloon.y - catloon.radius;
            let catBottom = catloon.y + catloon.radius;
            
            let pipeLeft = p.x;
            let pipeRight = p.x + this.w;
            let topPipeBottom = p.y;
            let bottomPipeTop = p.y + this.gap;

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
    score.draw();
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
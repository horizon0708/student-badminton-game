class Player {
    x = 0 
    y = 0
    color = "green"  
    width = 100
    height = 100
    speed = 100
    isMovingLeft = false
    isMovingRight = false

    constructor(x, y) {
        this.x = x;  
        this.y = y;
    }
    update(deltaTime) {
        const dt = deltaTime / 1000;
        // add speed
        let speed = 0; // if nothing is being pressed, speed is 0
        if (this.isMovingLeft) {
            speed= -this.speed; // if player is pressing left, its minus speed
        }
        if (this.isMovingRight) {
            speed = +this.speed;
        }

        // Update the positing using the speed
        this.x += speed* dt;
    
    }
    draw(ctx) {
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(personImage, this.x, this.y, this.width, this.height);
    } 

    hitBall(ball) {
        if (!ball.isCollidingWithPlayer(this) || !ball.canBeHit) {
            return;
        }

        // Simply flip the vertical velocity
        ball.speedY = -ball.speedY;
        ball.speedX = -ball.speedX;
        ball.canBeHit = false;
    }
}


class Ball {
    radius = 10;
    speedX = 20;
    speedY = 20;
    canBeHit = true;

    constructor(x, y,speed,angle) {
        this.initialX = x;  // Store initial position
        this.initialY = y;
        this.reset();
        this.speed = speed
        this.angle = angle * (Math.PI / 180)
        this.speedX = Math.cos(this.angle) * speed
        this.speedY = -Math.sin(this.angle) * speed
    }

    reset() {
        this.x = this.initialX;
        this.y = this.initialY;
        this.angle = this.initialAngle * (Math.PI / 180);
        this.canBeHit = true;
    }

    update(deltaTime) {
        // Convert deltaTime to seconds
        const dt = deltaTime / 1000;
        
        // Update X position
        this.x += this.speedX * dt
        // Update Y position
        this.y += this.speedY * dt
        // Apply gravity to vertical velocity
        this.speedY += 300 * dt
    }

    draw(ctx) {
        // draw ball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    isCollidingWithPlayer(player) {
        // Check if ball is within the player's rectangle
        return this.x + this.radius > player.x &&
               this.x - this.radius < player.x + player.width &&
               this.y + this.radius > player.y &&
               this.y - this.radius < player.y + player.height;
    }
}

var lastTime = 0;
var canvas = document.getElementById('gameCanvas');
canvas.style.border = '1px solid black';
canvas.style.background = '#fff';

let playerOne = new Player(300, 400); 
let playerTwo = new Player(100, 400); 

var ctx = canvas.getContext('2d');
var backgroundImage = new Image();
backgroundImage.onload = startWhenReady;
backgroundImage.src = './backroundimage.jpeg';

var personImage = new Image();
personImage.onload = startWhenReady;
personImage.src = './badmintonperson.png';

var personImage2 = new Image();
personImage2.onload = startWhenReady;
personImage2.src = './badmintonperson2.png';

var balls = []
var timeSinceLastSpawn = 0;
const spawnInterval = 2000;

function gameLoop(currentTime) {
    // Calculate delta time
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Update spawn timer
    timeSinceLastSpawn += deltaTime;
    if (timeSinceLastSpawn >= spawnInterval) {
        // Spawn a new ball with random angle between 45 and 75 degrees
        const angle = Math.random() * 30 + 45;
        const speed = Math.random() * 100 + 400; // Random speed between 400-500
        balls.push(new Ball(10, canvas.height - 100, speed, angle));
        timeSinceLastSpawn = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    playerOne.update(deltaTime); 
    playerOne.draw(ctx); 

    // Update and draw all balls
    balls.forEach((ball, index) => {
        ball.update(deltaTime);
        ball.draw(ctx);

        playerOne.hitBall(ball);
        
        // Optional: Remove balls that go off screen
        if (ball.y > canvas.height || ball.x < 0 || ball.x > canvas.width) {
            balls.splice(index, 1);
        }
    });
    
    requestAnimationFrame(gameLoop);
}

// Start the game loop

// Track loaded images
let loadedImages = 0;
const totalImages = 3;

function startGame() {
    lastTime = 0;
    requestAnimationFrame(gameLoop);
}

function startWhenReady() { 
    loadedImages++;
    if(loadedImages === totalImages) {
        startGame();
    }
}

// Set up keyboard controls
// when key is pressed DOWN
document.addEventListener('keydown', (event) => {
    if(event.key === `ArrowLeft`) {
        playerOne.isMovingLeft = true;
        return
    }
    if(event.key === `ArrowRight`) {
        playerOne.isMovingRight = true;
        return
    }
});

// when key is released
document.addEventListener('keyup', (event) => {
    if(event.key === `ArrowLeft`) {
        playerOne.isMovingLeft = false
        return
    }
    if(event.key === `ArrowRight`) {
        playerOne.isMovingRight = false;
        return
    }
});


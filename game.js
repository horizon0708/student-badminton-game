class Player {
    x = 0 
    y = 0
    color = "green"  
    width = 40 
    height = 60 
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
}


class Ball {
    radius = 10;
    speedX = 20;
    speedY = 20;

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
}

var lastTime = 0;
var canvas = document.getElementById('gameCanvas');
canvas.style.border = '1px solid black';
canvas.style.background = '#fff';
let playerOne = new Player(300, 400); // <- add this line
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


// initialize ball here
var ball = new Ball(canvas.width / 2, canvas.height - 100,200,10) ;
var ball2 = new Ball(200,200,300,60);


function gameLoop(currentTime) {
    // Calculate delta time
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Clear canvas

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    playerOne.update(deltaTime); 
    playerOne.draw(ctx); 
    // Update and draw game objects
    if(ball) {
        // Update and draw ball
        ball.update(deltaTime);
        ball.draw(ctx);
    }
    if(ball2) {
        // Update and draw ball
        ball2.update(deltaTime);
        ball2.draw(ctx);
    }
    
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


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size based on device pixel ratio for better rendering on high-density screens
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;

// Scale canvas drawing context
ctx.scale(devicePixelRatio, devicePixelRatio);

// Game variables
const carWidth = 50;
const carHeight = 100;
const carSpeed = 5; // Speed at which the car moves
const obstacleSpeed = 5; // Speed at which the obstacles move
let carX = canvas.width / 2 - carWidth / 2;
let carY = canvas.height - carHeight - 10;
let obstacles = [];
let score = 0;
let highScore = parseInt(localStorage.getItem('highScore'), 10) || 0; // Ensure it's a number

// Handle touch controls for mobile
let touchStartX = 0;

canvas.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
    event.preventDefault(); // Prevent default touch actions like scrolling
});

canvas.addEventListener('touchmove', function(event) {
    let touchX = event.touches[0].clientX;
    let deltaX = touchX - touchStartX;

    console.log('Touch Move - DeltaX:', deltaX); // Debugging output

    // Adjust car position based on touch movement
    if (Math.abs(deltaX) > 10) { // Check if movement is significant
        if (deltaX > 0 && carX + carWidth < canvas.width) {
            carX += carSpeed;
        } else if (deltaX < 0 && carX > 0) {
            carX -= carSpeed;
        }

        touchStartX = touchX; // Update touch start position
    }

    event.preventDefault(); // Prevent default touch actions like scrolling
});

canvas.addEventListener('touchend', function(event) {
    // Optional: Handle touch end if needed
});

// Handle keyboard controls for desktop
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        if (carX + carWidth < canvas.width) {
            carX += carSpeed;
        }
    } else if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        if (carX > 0) {
            carX -= carSpeed;
        }
    }
});

function updateScore() {
    score++;
    document.getElementById('score').textContent = `Score: ${score}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // Save new high score
        document.getElementById('highScore').textContent = `High Score: ${highScore}`; // Update display
    }
}

function drawCar() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(carX, carY, carWidth, carHeight);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    // Move obstacles downwards
    obstacles.forEach(obstacle => {
        obstacle.y += obstacleSpeed;
    });

    // Remove obstacles that have passed the bottom of the canvas
    obstacles = obstacles.filter(obstacle => obstacle.y <= canvas.height);

    // Add new obstacles
    if (Math.random() < 0.02) {
        let obstacleWidth = Math.random() * (canvas.width / 4) + 20; // Set obstacle width within a reasonable range
        let obstacleX = Math.random() * (canvas.width - obstacleWidth);
        obstacles.push({ x: obstacleX, y: -30, width: obstacleWidth, height: 30 });
    }
}

function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (carX < obstacle.x + obstacle.width &&
            carX + carWidth > obstacle.x &&
            carY < obstacle.y + obstacle.height &&
            carY + carHeight > obstacle.y) {
            // Collision detected
            gameOver();
        }
    });
}

function gameOver() {
    alert(`Game Over! Your score: ${score}`);
    score = 0;
    obstacles = [];
    carX = canvas.width / 2 - carWidth / 2; // Reset car position
    carY = canvas.height - carHeight - 10; // Reset car position
    document.getElementById('score').textContent = `Score: ${score}`;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCar();
    drawObstacles();
    updateObstacles();
    checkCollisions();
    updateScore();

    requestAnimationFrame(gameLoop);
}

// Initialize high score display
document.getElementById('highScore').textContent = `High Score: ${highScore}`;

// Start game loop
gameLoop();

const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");

const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const pauseBtn = document.querySelector("#pauseBtn");

const upBtn = document.querySelector("#up");
const downBtn = document.querySelector("#down");
const leftBtn = document.querySelector("#left");
const rightBtn = document.querySelector("#right");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const boardBackground = "green";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "yellow";

const unitSize = 25;

let running = false;

let xVelocity = unitSize;
let yVelocity = 0;

let foodX;
let foodY;

let score = 0;

let paused = false;

let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];

window.addEventListener("keydown", changeDirection);
pauseBtn.addEventListener("click", togglePause);
resetBtn.addEventListener("click", resetGame);

// MOBILE CONTROLS

upBtn.addEventListener("click", () => {
    if (yVelocity != unitSize) {
        xVelocity = 0;
        yVelocity = -unitSize;
    }
});

downBtn.addEventListener("click", () => {
    if (yVelocity != -unitSize) {
        xVelocity = 0;
        yVelocity = unitSize;
    }
});

leftBtn.addEventListener("click", () => {
    if (xVelocity != unitSize) {
        xVelocity = -unitSize;
        yVelocity = 0;
    }
});

rightBtn.addEventListener("click", () => {
    if (xVelocity != -unitSize) {
        xVelocity = unitSize;
        yVelocity = 0;
    }
});

gameStart();

function gameStart() {
    running = true;
    scoreText.textContent = score;

    createFood();
    drawFood();

    nextTick();
}

function nextTick() {
    if (running && !paused) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100);
    } else if (!running){
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        return (
            Math.round((Math.random() * (max - min) + min) / unitSize) *
            unitSize
        );
    }

    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);

    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = score;

        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;

    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);

        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

function changeDirection(event) {
    const keyPressed = event.keyCode;

    const LEFT = [37, 65];
    const UP = [38, 87];
    const RIGHT = [39, 68];
    const DOWN = [40, 83];

    const goingUp = yVelocity == -unitSize;
    const goingDown = yVelocity == unitSize;
    const goingRight = xVelocity == unitSize;
    const goingLeft = xVelocity == -unitSize;

    switch (true) {
        case LEFT.includes(keyPressed) && !goingRight:
            xVelocity = -unitSize;
            yVelocity = 0;
            break;

        case UP.includes(keyPressed) && !goingDown:
            xVelocity = 0;
            yVelocity = -unitSize;
            break;

        case RIGHT.includes(keyPressed) && !goingLeft:
            xVelocity = unitSize;
            yVelocity = 0;
            break;

        case DOWN.includes(keyPressed) && !goingUp:
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    switch (true) {
        case snake[0].x < 0:
            running = false;
            break;

        case snake[0].x >= gameWidth:
            running = false;
            break;

        case snake[0].y < 0:
            running = false;
            break;

        case snake[0].y >= gameHeight:
            running = false;
            break;
    }

    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
        }
    }
}

function displayGameOver() {
    ctx.font = "50px Courier";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);

    running = false;
}

function resetGame() {
    score = 0;

    xVelocity = unitSize;
    yVelocity = 0;

    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];

    gameStart();
}

function togglePause() {
    paused = !paused;

    if (paused) {
        ctx.font = "50px Courier";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";

        ctx.fillText("PAUSED", gameWidth / 2, gameHeight / 2);

        pauseBtn.textContent = "Resume";
    } else {
        pauseBtn.textContent = "Pause";
        nextTick();
    }
}

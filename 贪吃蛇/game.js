// 获取DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

// 游戏参数
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// 蛇的属性
let snake = [];
let snakeX = 10 * gridSize;
let snakeY = 10 * gridSize;
let velocityX = 0;
let velocityY = 0;
let snakeLength = 5;

// 食物属性
let foodX = 5 * gridSize;
let foodY = 5 * gridSize;
let score = 0;

// 游戏状态
let gameRunning = false;
let gameLoopId = null;
let gameSpeed = 150; // 初始速度，数值越小速度越快
let hasStartedMoving = false; // 标识蛇是否已经开始移动

// 初始化蛇
function initSnake() {
    snake = [];
    snakeLength = 5;
    snakeX = 10 * gridSize;
    snakeY = 10 * gridSize;
    velocityX = 0;
    velocityY = 0;
    score = 0;
    hasStartedMoving = false; // 重置移动状态
    scoreElement.textContent = score;
    generateFood();
}

// 生成食物
function generateFood() {
    // 随机生成食物位置，确保不在蛇身上
    let validPosition = false;
    while (!validPosition) {
        foodX = Math.floor(Math.random() * tileCount) * gridSize;
        foodY = Math.floor(Math.random() * tileCount) * gridSize;
        validPosition = true;
        // 检查食物是否在蛇身上
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === foodX && snake[i].y === foodY) {
                validPosition = false;
                break;
            }
        }
    }
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制食物
    ctx.fillStyle = '#f44336';
    ctx.fillRect(foodX, foodY, gridSize, gridSize);

    // 只有当hasStartedMoving为true时才移动蛇头
    if (hasStartedMoving) {
        snakeX += velocityX;
        snakeY += velocityY;

        // 边界检测（碰到边界游戏结束）
        if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
            gameOver();
            return;
        }

        // 添加新的蛇头
        snake.unshift({ x: snakeX, y: snakeY });

        // 控制蛇的长度
        if (snake.length > snakeLength) {
            snake.pop();
        }

        // 检测蛇头是否碰到蛇身
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snakeX && snake[i].y === snakeY) {
                gameOver();
                return;
            }
        }

        // 检测是否吃到食物
        if (snakeX === foodX && snakeY === foodY) {
            snakeLength++;
            score += 10;
            scoreElement.textContent = score;
            generateFood();
            // 随着分数增加，游戏速度加快
            if (score % 50 === 0 && gameSpeed > 50) {
                gameSpeed -= 10;
                if (gameLoopId) {
                    clearInterval(gameLoopId);
                    gameLoopId = setInterval(draw, gameSpeed);
                }
            }
        }
    }

    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
        // 蛇头颜色不同
        if (i === 0) {
            ctx.fillStyle = '#2E7D32';
        } else {
            // 蛇身颜色渐变
            const greenValue = 150 + i * 15;
            ctx.fillStyle = `rgb(0, ${Math.min(greenValue, 255)}, 0)`;
        }
    }
}

// 游戏结束
function gameOver() {
    clearInterval(gameLoopId);
    gameRunning = false;
    alert(`游戏结束！你的分数是: ${score}`);
    startBtn.disabled = false;
}

// 开始游戏
function startGame() {
    if (!gameRunning) {
        initSnake();
        gameRunning = true;
        startBtn.disabled = true;
        gameLoopId = setInterval(draw, gameSpeed);
    }
}

// 暂停游戏
function pauseGame() {
    if (gameRunning) {
        clearInterval(gameLoopId);
        gameRunning = false;
        startBtn.disabled = false;
    } else if (snake.length > 0) {
        gameRunning = true;
        startBtn.disabled = true;
        gameLoopId = setInterval(draw, gameSpeed);
    }
}

// 键盘控制
document.addEventListener('keydown', (event) => {
    // 防止蛇反向移动
    if (event.key === 'ArrowUp' && velocityY !== gridSize) {
        velocityX = 0;
        velocityY = -gridSize;
        hasStartedMoving = true; // 按下方向键，开始移动
    } else if (event.key === 'ArrowDown' && velocityY !== -gridSize) {
        velocityX = 0;
        velocityY = gridSize;
        hasStartedMoving = true; // 按下方向键，开始移动
    } else if (event.key === 'ArrowLeft' && velocityX !== gridSize) {
        velocityX = -gridSize;
        velocityY = 0;
        hasStartedMoving = true; // 按下方向键，开始移动
    } else if (event.key === 'ArrowRight' && velocityX !== -gridSize) {
        velocityX = gridSize;
        velocityY = 0;
        hasStartedMoving = true; // 按下方向键，开始移动
    } else if (event.key === ' ') {
        // 空格键暂停/继续
        pauseGame();
    }
});

// 按钮事件监听
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);

// 初始化游戏
initSnake();
// 绘制初始状态
draw();
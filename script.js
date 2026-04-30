const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// UI
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const winScreen = document.getElementById("winScreen");
const scoreText = document.getElementById("score");

// Images
let playerImg = new Image();
playerImg.src = "player.png";

let gfImg = new Image();
gfImg.src = "gf.png";

// Player
let player = {
  x: 100,
  y: 180,
  size: 50,
  speed: 5
};

// Controls
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Game data
let obstacles = [];
let frame = 0;
let score = 0;
let gameRunning = false;

// Start
function startGame() {
  startScreen.classList.add("hidden");
  gameRunning = true;
  gameLoop();
}

// Restart
function restartGame() {
  gameOverScreen.classList.add("hidden");
  winScreen.classList.add("hidden");

  obstacles = [];
  player.x = 100;
  player.y = 180;
  frame = 0;
  score = 0;
  gameRunning = true;

  gameLoop();
}

// Spawn obstacles
function spawnObstacle() {
  obstacles.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 60),
    width: 30,
    height: 60
  });
}

// Movement
function movePlayer() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  // Boundaries
  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
  if (player.y > canvas.height - player.size) player.y = canvas.height - player.size;
}

// Collision
function checkCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.size > b.x &&
         a.y < b.y + b.height &&
         a.y + a.size > b.y;
}

// Game Loop
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();

  // Draw Player (face)
  ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);

  // Obstacles
  if (frame % 90 === 0) spawnObstacle();

  obstacles.forEach((obs) => {
    obs.x -= 4;

    ctx.fillStyle = "red";
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    if (checkCollision(player, obs)) {
      gameRunning = false;
      gameOverScreen.classList.remove("hidden");
    }
  });

  // Score
  score++;
  scoreText.innerText = "Score: " + score;

  // WIN CONDITION (reach end)
  if (score > 1500) {
    gameRunning = false;

    // Draw GF
    ctx.drawImage(gfImg, 600, 150, 80, 80);

    winScreen.classList.remove("hidden");
    return;
  }

  frame++;
  requestAnimationFrame(gameLoop);
}

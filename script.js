const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 640;

// UI
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const winScreen = document.getElementById("winScreen");
const hud = document.getElementById("hud");

// Images
let playerImg = new Image();
playerImg.src = "player.png";

let gfImg = new Image();
gfImg.src = "gf.png";

// Player
let player = { x: 150, y: 200, size: 70, speed: 5 };

// Controls
let keys = {};
function startMove(k){ keys[k] = true; }
function stopMove(k){ keys[k] = false; }

// Game data
let obstacles = [];
let score = 0;
let gameRunning = false;
let winning = false;
let hugging = false;
let hugProgress = 0;
let hearts = [];

// Start
function startGame(){
  startScreen.classList.add("hidden");
  gameRunning = true;
  gameLoop();
}

// Restart
function restartGame(){
  gameOverScreen.classList.add("hidden");
  winScreen.classList.add("hidden");
  obstacles = [];
  score = 0;
  player.x = 150;
  player.y = 200;
  gameRunning = true;
  winning = false;
  hugging = false;
  hugProgress = 0;
  gameLoop();
}

// Spawn obstacles
function spawnObstacle(){
  obstacles.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    size: 30,
    color: `hsl(${Math.random()*360},70%,60%)`,
    type: Math.random() > 0.5 ? "circle" : "heart"
  });
}

// Draw heart
function drawHeart(x,y,s,c){
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.bezierCurveTo(x,y-10,x-15,y-10,x-15,y);
  ctx.bezierCurveTo(x-15,y+10,x,y+15,x,y+20);
  ctx.bezierCurveTo(x,y+15,x+15,y+10,x+15,y);
  ctx.fill();
}

// Movement
function movePlayer(){
  player.y += 2;

  if(keys["ArrowLeft"]) player.x -= player.speed;
  if(keys["ArrowRight"]) player.x += player.speed;
  if(keys["ArrowUp"]) player.y -= player.speed;

  if(player.x < 0) player.x = 0;
  if(player.x > canvas.width - player.size) player.x = canvas.width - player.size;
  if(player.y > canvas.height - player.size) player.y = canvas.height - player.size;
}

// Collision
function hit(a,b){
  return a.x < b.x + b.size &&
         a.x + a.size > b.x &&
         a.y < b.y + b.size &&
         a.y + a.size > b.y;
}

// Hearts
function createHearts(x,y){
  for(let i=0;i<15;i++){
    hearts.push({
      x,y,
      vx:(Math.random()-0.5)*3,
      vy:-Math.random()*3,
      life:60
    });
  }
}

// Loop
function gameLoop(){
  if(!gameRunning) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(!winning) movePlayer();

  ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);

  if(!winning && Math.random()<0.03) spawnObstacle();

  obstacles.forEach(o=>{
    o.y += 4;

    if(o.type=="circle"){
      ctx.fillStyle=o.color;
      ctx.beginPath();
      ctx.arc(o.x,o.y,o.size/2,0,Math.PI*2);
      ctx.fill();
    } else drawHeart(o.x,o.y,o.size,o.color);

    if(!winning && hit(player,o)){
      gameRunning=false;
      gameOverScreen.classList.remove("hidden");
    }
  });

  if(!winning) score++;
  hud.innerText="Score: "+score;

  // WIN
  if(score>1000 && !winning) winning=true;

  if(winning){
    let tx = canvas.width/2 - 50;
    let ty = canvas.height - 120;

    player.x += (tx-player.x)*0.05;
    player.y += (ty-player.y)*0.05;

    ctx.drawImage(gfImg, tx, ty, 100, 100);

    if(!hugging && Math.abs(player.x-tx)<10){
      hugging=true;
      createHearts(tx+50,ty+50);
    }

    if(hugging){
      hugProgress+=0.05;
      let s=1+Math.sin(hugProgress*5)*0.1;

      ctx.save();
      ctx.translate(tx+50,ty+50);
      ctx.scale(s,s);
      ctx.drawImage(playerImg,-50,-50,100,100);
      ctx.drawImage(gfImg,0,-50,100,100);
      ctx.restore();

      ctx.fillStyle="pink";
      ctx.font="20px Arial";
      ctx.fillText("Together Forever ❤️",60,80);

      if(hugProgress>3){
        gameRunning=false;
        winScreen.classList.remove("hidden");
      }
    }
  }

  // hearts
  hearts.forEach((h,i)=>{
    h.x+=h.vx; h.y+=h.vy; h.life--;
    ctx.fillStyle="pink";
    ctx.beginPath();
    ctx.arc(h.x,h.y,4,0,Math.PI*2);
    ctx.fill();
    if(h.life<=0) hearts.splice(i,1);
  });

  requestAnimationFrame(gameLoop);
}

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let ballRadius = 10;
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let brickWidth = 75;
let brickColumnCount = 5;
let brickRowCount = 5;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0; 
let color = "red"; 
let colors = ["red", "green", "blue", "grey"]; 
let start = document.getElementById("start"); 
let div = document.getElementById("gameover")
div.style.transition = "all 0.2s";


start.addEventListener("click", reloadGame); // Button that reloads the game

// Reloads game 
function reloadGame(){
   document.location.reload();
}
 // Div that comes down when you lose
function gameOver(){
  div.style.top = "100px";
}
// Gives a random color to the ball and makes sure it doesnt return the same color twice
function colorRandom (){
  let tempcolor = color;
  while(tempcolor == color){
    tempcolor = colors[Math.floor(Math.random()*4)];
  }
  color = tempcolor;
}

let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(let r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
// Checks the keys that you press during the game 
function keyDownHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = true;
  }
  else if(e.keyCode == 37) {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = false;
  }
  else if(e.keyCode == 37) {
    leftPressed = false;
  }
}
// Adds the mouse to the paddle 
function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
    }
  }
// 
function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
      for(let r=0; r<brickRowCount; r++) {
        let b = bricks[c][r];
        if(b.status == 1) {
          if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
            dy = -dy;
            b.status = 0;
            score++;
            colorRandom(); // When the ball hits the wall or ricks it chnges color
            if(score == brickRowCount*brickColumnCount) {
              clearInterval(myInterval); // Needed for Chrome to end game
              alert("YOU WIN, CONGRATS!"); 
              document.location.reload();
            }
          }
        }
      }
    }
  }
// Draws the ball on the canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}
//Draws the paddle on the canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}
// Draws the bricks on the canvas
function drawBricks() {
  for(let c=0; c<brickColumnCount; c++) {
    for(let r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        let brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
// Draws teh score on the canvas
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Score: "+score, 8, 20);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();
  
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
      dx = -dx;
      colorRandom();
    }
    if(y + dy < ballRadius) {
      dy = -dy;
      colorRandom();
    }
    else if(y + dy > canvas.height-ballRadius) {
      if(x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
        colorRandom();
      }
      else {
        clearInterval(myInterval); // Needed for Chrome to end game
        gameOver();
      }
    }
  
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
      paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
      paddleX -= 7;
    }
  
    x += dx;
    y += dy;
  }

let myInterval = setInterval(draw, 10);
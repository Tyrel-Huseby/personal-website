var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var launch = false;

var waveCount = document.getElementById("wave-count");
var totalScoreBar = document.getElementById("total-score");



const accel = 8; //lower number is faster can not be 0
const stat = 4;//brick max status 

//ball parameters
var ballRadius = 8;
var x = canvas.width/2;
var y = canvas.height - 18; // 18 = equals paddleHeight - ballRadius
var dx = -2;
var dy = -2;

//paddle parameters
var paddleHeight = 10;
var paddleWidth = 75;
var paddleCenter = paddleWidth/2;
var centerWidth = 15;
var centerStart = 30
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

// for launch
var idle = paddleHeight + ballRadius;
// y = y + idle


//brick parameters
var brickRowCount = 11;
var brickColumnCount = 9;
var brickPadding = 10;
var brickWidth = ((canvas.width - 60) - (brickPadding*(brickRowCount - 1)))/(brickRowCount);
var brickHeight = 20;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//brick array
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: Math.floor((Math.random() * stat)) };
  }
}

//scoring
var score = 0;
var lives = 3;

// console.log(sessionStorage.getItem("wave"));
if (sessionStorage.getItem("wave") == 1 || sessionStorage.getItem("wave") == null){
  var totalScore = 0;
  var wave = 1;
  sessionStorage.setItem("totalScore", totalScore);
  sessionStorage.setItem("wave", wave);
}


var levelMaxScore = 0;
for(var c=0; c<brickColumnCount; c++) {
  for(var r=0; r<brickRowCount; r++) {
      levelMaxScore += bricks[c][r].status;
  }
}

totalScoreBar.innerHTML = `<h1>Total Score: ${sessionStorage.getItem("totalScore")}</h1>`;
waveCount.innerHTML = `<h1>Wave: ${sessionStorage.getItem("wave")}</h1>`;


//launch control
var oneClick = 1;

//listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//Event Handler functions
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleCenter;
    if (paddleX < 0) {
      paddleX = 0;
    }
    if (paddleX > canvas.width - paddleWidth){
      paddleX = canvas.width - paddleWidth;
    }

  }
}
//Launch Ball on click
function launchBall() {
  if (oneClick == 1) {
    //** trig caclulations for launch only
    var changeX = x - paddleX; 
    changeX = changeX - paddleCenter;

    var deltaY = Math.sqrt(Math.pow(paddleCenter, 2) - Math.pow(changeX, 2));
    var theta = Math.atan2(deltaY, changeX);
    dy = (deltaY * (1 / Math.tan(theta)) * Math.tan(theta))/accel;
    dx = dy * (1 / Math.tan(theta));
    dy = -dy;
    //end trig

    launch = true;
    oneClick--;
  }
  else{
    return null;
  }
}

//End Event Handlers


function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status >= 1) {
        if(x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {

          if (b.y  < y && y < b.y + brickHeight) {
            dx = -dx;
          }

          else{
            dy = -dy;
          }
         
          b.status -= 1;
          score++;
          if(score == levelMaxScore) {
            wave = Number(sessionStorage.getItem("wave"));
            wave++;
            
            totalScore = Number(sessionStorage.getItem("totalScore")) + score;
            sessionStorage.setItem("totalScore", totalScore);
            sessionStorage.setItem("wave", wave);

            totalScoreBar.innerText = `Total Score: ${sessionStorage.getItem("totalScore")}`;
            waveCount.innerText = `Wave: ${sessionStorage.getItem("wave")}`;
            
            
            document.location.reload();
          }
          
          break;
        }
      }
    }
  }
}
//End collision function

function newGame(){
  sessionStorage.clear();
  document.location.reload();
}

//Begin Draw Functions
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "grey";
  ctx.fill();
  ctx.closePath();
}

function drawPaddleBorder(xPos, yPos, width, height, thickness = .5) {
  ctx.fillStyle='#000';
  ctx.fillRect(xPos - (thickness), yPos, width + (thickness * 2), height + (thickness * 2));
}

function drawPaddle() {
  ctx.beginPath();

  drawPaddleBorder(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);

  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
function drawPaddleCenter() {
  ctx.beginPath();

  drawPaddleBorder(paddleX + centerStart, canvas.height-paddleHeight, centerWidth, paddleHeight);

  ctx.rect(paddleX + centerStart, canvas.height-paddleHeight, centerWidth, paddleHeight);
  ctx.fillStyle = "#D1E8E2";
  ctx.fill();
  ctx.closePath();
}

function drawBrickBorder(xPos, yPos, width, height, thickness = 1) {
  ctx.fillStyle='dimgrey';
  ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}

function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status >= 1) {
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        
        drawBrickBorder(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight)
        
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        
        if (bricks[c][r].status == 3){
          ctx.fillStyle = "gold"
        }
        else if (bricks[c][r].status == 2){
          ctx.fillStyle = "chocolate"
        } 
        else{
          ctx.fillStyle = "limegreen";
        }
        
        
        ctx.fill();

        ctx.closePath();
      }
    }
  }
}
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
  ctx.fillText("Max: "+levelMaxScore, 150, 20);
}
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
//End Draw Functions

//Main function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawPaddleCenter();
  drawScore();
  drawLives();
  collisionDetection();
  if (launch == false){
    dy = 0;
    if (x <= paddleX || x >= paddleX + paddleWidth){
      if (x < paddleX) {
        x = paddleX;
      }

      else if (x > paddleX + paddleWidth){
        x = paddleX + paddleWidth;
      }
      else {
      dx = -dx
      x += dx;
      }
    }
    else{
      x += dx;
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
      paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
      paddleX -= 7;
    }
    requestAnimationFrame(draw);
  }

  else {
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if(y + dy < ballRadius) {
      dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius - paddleHeight) {

      if(x > paddleX && x < paddleX + paddleWidth) { 
        var changeX = x - paddleX; 
        changeX = changeX - paddleCenter;

        //** trig caclulations
        var deltaY = Math.sqrt(Math.pow(paddleCenter, 2) - Math.pow(changeX, 2));
        var theta = Math.atan2(deltaY, changeX);
        dy = (deltaY * (1 / Math.tan(theta)) * Math.tan(theta))/accel;
        dx = dy * (1 / Math.tan(theta));
        dy = -dy;
        //console.log(`dx ${dx} : dy ${dy} : the angle in rad ${theta}  x,y: (${changeX}, ${deltaY})  :: paddleX : ${paddleX}`);
        //console.log(`y - ballRadius ${y - ballRadius} : canvas.height - paddleHeight ${canvas.height - paddleHeight}`);  
        
      }
      else {
        lives--;
        if(!lives) {
          alert("GAME OVER");
          newGame();
        }
        else {
          x = canvas.width/2;
          y = canvas.height - idle;
          dx = -2;
          dy = 0;
          paddleX = (canvas.width-paddleWidth)/2;
          launch = false;
          oneClick = 1;
        }
      }
    }
    //end paddle collision

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
      paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    x += dx;
    y += dy;
    
    requestAnimationFrame(draw);
  }
}

draw();
//fix end scoring frame
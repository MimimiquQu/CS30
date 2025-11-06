const BOX_WIDTH = 600;
const BOX_HEIGHT = 600;
const BALL_DIAMETER = 8
const GRID_SIZE = 8;
const GRID_ROWS = BOX_HEIGHT/GRID_SIZE;
const GRID_COLS = BOX_WIDTH/GRID_SIZE;
const PARTICLE_MASS = 1;

let ballArray = [];
let numberOfParticles;
let maxSpeed = 5;
let distributionWidth = 0.5;
let colorDistributionMidpoint;
let plotDistributionPrecision = 30; // how many intervals to divide the speed/KE distribution graphs into
let grid = [];


function setup() {
  // I have to define the colorDistributionMidpoint in setup() because it uses the "log" and "exp" functions which are not available until p5.js is initialized.
  colorDistributionMidpoint = (-1)*distributionWidth*log((1+exp((-1)/distributionWidth))/2);
  createCanvas(windowWidth, windowHeight);
  noStroke();
  angleMode(DEGREES);
  drawBox();
  initializeGrid();
}

function draw() {
  background(0);
  drawBox();
  moveCircle();
  checkCollisions();
  bounceEdge();
  showCircle();
  plotValues();
}

function mousePressed() {
  for (let i=0; i<40; i++) {
    spawnBall(mouseX, mouseY);
  }
}

function initializeGrid() {
  // grid is an 3D array. grid[i][j] contains an array of balls in cell(i,j). For example, grid[i][j] = [ballArray[1], ballArray[5], ... ]
  for (let i=0; i<GRID_COLS; i++) {
    grid.push([]);
    for (let j=0; j<GRID_ROWS; j++) {
      grid[i].push([]);
    }
  }
}


function spawnBall(x, y) {
  // let radius = random(25, 75);
  let radius = BALL_DIAMETER/2;
  x = min(max(radius, x), width-radius);
  y = min(max(radius, y), height-radius);
  // picks a random velocity from 0 to maxSpeed and a random direction, then convert them to dx, dy via trigonometry.
  let v = random(0, maxSpeed);
  let dir = random(0, 360);
  dx = v*cos(dir);
  dy = v*sin(dir);

  let newBall = {
    x : x,
    y : y,
    dx : dx,
    dy : dy,
    radius : radius,
    r : 255,
    g : 255,
    b : 255,
  };

  ballArray.push(newBall);
  numberOfParticles = ballArray.length;
}

function moveCircle() {
  for (let i=0; i<ballArray.length; i++) {
    let ball = ballArray[i];
    ball.x = ball.x + ball.dx;
    ball.y = ball.y + ball.dy;
  }
}

function drawBox() {
  color(255);
  stroke(1000);
  noFill();
  rect((width-BOX_WIDTH)/2,(height-BOX_HEIGHT)/2, BOX_WIDTH, BOX_HEIGHT);
  noStroke();
  fill(255);
}

function bounceEdge() {
  let leftEdge = (width-BOX_WIDTH)/2;
  let rightEdge = (width+BOX_WIDTH)/2;
  let topEdge = (height-BOX_HEIGHT)/2;
  let bottomEdge = (height+BOX_HEIGHT)/2;

  for (let i=0; i<ballArray.length; i++) {
    let ball = ballArray[i];
    //should i bounce?
    if (ball.x < leftEdge+ball.radius || ball.x > rightEdge - ball.radius) {
      ball.x = max(leftEdge+ball.radius, min(ball.x, rightEdge - ball.radius));
      ball.dx = ball.dx * -1;
      // randomizeColor(ball);
    }
    if (ball.y < topEdge+ball.radius || ball.y > bottomEdge - ball.radius) {
      ball.y = max(topEdge+ball.radius, min(ball.y, bottomEdge - ball.radius));
      ball.dy = ball.dy * -1;
      // randomizeColor(ball);
    }
  }
}

// improve collision detection algorithm with 2D spatial partitioning.
function partitionBalls() {
  // if a ball is in cell (i, j), it should be in the array grid[i][j].
  // first, clear the grid.
  for (let row of grid) {
    for (let col of row) {
      col.clear();
    }
  }
  for (let ball of ballArray) {
    let gridX = floor((ball.x - (width-BOX_WIDTH)/2)/GRID_SIZE);
    let gridY = floor((ball.y - (height-BOX_HEIGHT)/2)/GRID_SIZE);
    grid[gridX][gridY].push(ball);
  }
}
// check collisions between balls
function checkCollisions() {

  let d = dist(ball1.x, ball1.y, ball2.x, ball2.y);
  if (d <= ball1.radius + ball2.radius) {
    collide(ball1, ball2);
  }
}

function collide(ball1, ball2) {
  // define vectors
  let normal = createVector(ball2.x-ball1.x, ball2.y-ball1.y);
  normal.normalize();
  let v1 = createVector(ball1.dx, ball1.dy);
  let v2 = createVector(ball2.dx, ball2.dy);
  let v1Dot = v1.dot(normal);
  let v2Dot = v2.dot(normal);
  // correct overlap
  let overlap = ball1.radius+ball2.radius-d;
  ball1.x -= overlap/2*normal.x;
  ball1.y -= overlap/2*normal.y;
  ball2.x += overlap/2*normal.x;
  ball2.y += overlap/2*normal.y;
  bounceEdge();
  // collides perfectly elastically, along the normal
  let v1Change = normal.copy();
  let v2Change = normal.copy();
  // assume that the masses of the balls are all the same, then they simply "exchange" velocities
  v1Change.mult(v2Dot-v1Dot);
  v2Change.mult(v1Dot-v2Dot);
  v1.add(v1Change);
  v2.add(v2Change);
  ball1.dx = v1.x;
  ball1.dy = v1.y;
  ball2.dx = v2.x;
  ball2.dy = v2.y;

  // change colors according to KE after collision
  // ballKE is the fraction of the ball's velocity to the initial maximum possible velocity (which is sqrt(2)*maxSpeed).
  // this part is meant to create a color gradient from pure blue (KE=0) to pure red (KE=max), which purple-pink-ish in the middle.
  // Basically, it requires a mapping from [0,1] to RGB values, which is equivalent to a point in 3D space (R,G,B).
  // The constraint is that when KE=0, (R,G,B)=(0,0,255), when KE=1, (R,G,B)=(255,0,0), and when KE=colorDistributionMidpoint, G should be at its maximum (255).
  // With the other constraint that the function should be segments of linear functions for simplicity, I derived the following equations for R,G,B respectively. This is technically a continuous collection of 4-dimensional lines. 
  // ball 1
  let ballKE = (sq(ball1.dx)+sq(ball1.dy))/(sqrt(2)*sq(maxSpeed));
  ball1.r = min(1,ballKE/colorDistributionMidpoint)*255;
  ball1.b = min(1,(1-ballKE)/(1-colorDistributionMidpoint))*255;
  ball1.g = 0.5*(1/colorDistributionMidpoint-1/(1-colorDistributionMidpoint))*ballKE-0.5*(1/colorDistributionMidpoint+1/(1-colorDistributionMidpoint))*abs(ballKE-colorDistributionMidpoint)+0.5/(1-colorDistributionMidpoint);
  // ball 2
  ballKE = (sq(ball2.dx)+sq(ball2.dy))/(sqrt(2)*sq(maxSpeed));
  ball2.r = min(1,ballKE/colorDistributionMidpoint)*255;
  ball2.b = min(1,(1-ballKE)/(1-colorDistributionMidpoint))*255;
  ball2.g = 0.5*(1/colorDistributionMidpoint-1/(1-colorDistributionMidpoint))*ballKE-0.5*(1/colorDistributionMidpoint+1/(1-colorDistributionMidpoint))*abs(ballKE-colorDistributionMidpoint)+0.5/(1-colorDistributionMidpoint);
}


function showCircle() {
  for (let i=0; i<ballArray.length; i++) {
    let ball = ballArray[i];
    // the kinetic energy of the ball
    
    fill(ball.r, ball.g, ball.b);
    circle(ball.x, ball.y, ball.radius*2);
  }
}

function plotValues() {
  let sumKE = 0;
  let sumSpeeds = 0;
  let speedDistribution = new Array(plotDistributionPrecision).fill(0);
  let kEDistribution = new Array(plotDistributionPrecision).fill(0);

  // Use a single loop to calculate average v and KE, and recording in an array.
  for (let ball of ballArray) {
    let v = sqrt(sq(ball.dx)+sq(ball.dy));
    let kE = 0.5*particleMass*sq(v);
    // add up individual speeds/KEs to calculate average
    sumSpeeds+=v;
    sumKE+=kE;
    // record values
    // take the floor of "(thisValue)/(maxValue) and multipled by plotDistributionPrecision(the number of intervals in the plot)" as "the interval (thisValue) is in" -> increment by 1
    // I set the (maxValue) for speed as as sqrt(2)*maxSpeed, because collisions speeds can go higher than initial speeds. 
    // The sqrt(2) factor is intended to give "buffer space" for speeds that are over the initial maximum possible speed.

    speedDistribution[min(plotDistributionPrecision-1, floor(v/(sqrt(2)*maxSpeed)*plotDistributionPrecision))] ++;
    // the same "buffer space" logic applies to KE as well.
    kEDistribution[min(plotDistributionPrecision-1, floor(kE/(sqrt(2)*particleMass*sq(maxSpeed))*plotDistributionPrecision))] ++;
    
  }
  let avrKE = sumKE/numberOfParticles;
  let avrSpeed = sumSpeeds/numberOfParticles;

  //display avr v and KE as text
  textAlign(LEFT);
  textSize(20);
  textStyle(NORMAL);
  textFont("Verdana");
  fill("white");
  text("Average Speed: "+avrSpeed.toFixed(3), width*0.05, height*0.75 + 100);
  text("Average Kinetic Energy: "+avrKE.toFixed(3), width*0.05, height*0.5-30);

  //display v,KE distribution via a graph
  // draw rectangles with height corresponding to frequency
  text("Speed Distribution", width*0.05, height*0.75 + 70);
  let peakFrq = findMax(speedDistribution, 1); // call this function to find the max(numerically largest) element within the array
  for (let i=0; i<plotDistributionPrecision; i++) {
    rect(width*0.05+i*(plotDisplayWidth)/(plotDistributionPrecision), height*0.75+45 - speedDistribution[i]*plotDisplayHeight/peakFrq, plotDisplayWidth/plotDistributionPrecision + 1, speedDistribution[i]*plotDisplayHeight/peakFrq);
  }

  text("Kinetic Energy Distribution", width*0.05, height*0.5 - 60);
  peakFrq = findMax(kEDistribution, 1);
  for (let i=0; i<plotDistributionPrecision; i++) {
    rect(width*0.05+i*(plotDisplayWidth)/(plotDistributionPrecision), height*0.5-85 - kEDistribution[i]*plotDisplayHeight/peakFrq, plotDisplayWidth/plotDistributionPrecision + 1, kEDistribution[i]*plotDisplayHeight/peakFrq);
  }
}


//function to find the max for any array, useful for a lot of applications in this project and likely future ones too
function findMax(array, defaultValue) {
  if (array.length===0) return NaN;
  let maxElement = array[0];
  for (let element of array) {
    maxElement = max(maxElement, element);
  }
  return max(defaultValue, maxElement);
}
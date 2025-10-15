let theBallArray = [];
let maxSpeed = 6;
function setup() {
  createCanvas(windowWidth, windowHeight);
  spawnBall();
  noStroke();
  angleMode(DEGREES);
}

function draw() {
  background(0);
  moveCircle();
  checkCollisions();
  bounceEdge();
  showCircle();
  // console.log(y);
}

function mousePressed() {
  spawnBall(mouseX, mouseY);
}


function spawnBall(x, y) {
  // let radius = random(25, 75);
  let radius = 5;
  x = min(max(radius, x), width-radius);
  y = min(max(radius, y), height-radius);
  let newBall = {
    x : x,
    y : y,
    dx : random(-maxSpeed, maxSpeed),
    dy : random(-maxSpeed, maxSpeed),
    radius : radius,
    r : 255,
    g : 255,
    b : 255,
  };
  newBall.g = 0;
  newBall.r = 510*(sq(newBall.dx)+sq(newBall.dy))/(2*sq(maxSpeed))-255;
  newBall.b = 255-225*(sq(newBall.dx)+sq(newBall.dy))/(2*sq(maxSpeed));

  theBallArray.push(newBall);
}

function moveCircle() {
  for (let i=0; i<theBallArray.length; i++) {
    let theBall = theBallArray[i];
    theBall.x = theBall.x + theBall.dx;
    theBall.y = theBall.y + theBall.dy;
  }
}

function bounceEdge() {
  for (let i=0; i<theBallArray.length; i++) {
    let theBall = theBallArray[i];
    //should i bounce?
    if (theBall.x < 0 + theBall.radius || theBall.x > width - theBall.radius) {
      theBall.x = max(theBall.radius, min(theBall.x, width-theBall.radius));
      theBall.dx = theBall.dx * -1;
      randomizeColor(theBall);
    }
    if (theBall.y < 0 + theBall.radius || theBall.y > height - theBall.radius) {
      theBall.y = max(theBall.radius, min(theBall.y, height-theBall.radius));
      theBall.dy = theBall.dy * -1;
      randomizeColor(theBall);
    }
  }
}

// check collisions between balls
function checkCollisions() {
  for (let i=0; i<theBallArray.length; i++) {
    let ball1 = theBallArray[i];
    for (let j=i+1; j<theBallArray.length; j++) {
      let ball2 = theBallArray[j];
      let d = dist(ball1.x, ball1.y, ball2.x, ball2.y);
      if (d <= ball1.radius + ball2.radius) {
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
      }
    }
  }
}


function showCircle() {
  for (let i=0; i<theBallArray.length; i++) {
    let theBall = theBallArray[i];
    newBall.r = 510*(sq(newBall.dx)+sq(newBall.dy))/(2*sq(maxSpeed))-255;
    newBall.b = 255-225*(sq(newBall.dx)+sq(newBall.dy))/(2*sq(maxSpeed));
    fill(theBall.r, theBall.g, theBall.b);
    circle(theBall.x, theBall.y, theBall.radius*2)
  }
}

function randomizeColor(theBall) {
  theBall.r = random(255);
  theBall.g = random(255);
  theBall.b = random(255);
}

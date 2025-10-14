let theBallArray = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  spawnBall();
  noStroke();
  angleMode(DEGREES);
}

function draw() {
  background(255);
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
  let radius = 25;
  x = min(max(radius, x), width-radius);
  y = min(max(radius, y), height-radius);
  let newBall = {
    x : x,
    y : y,
    dx : random(-3, 3),
    dy : random(-3, 3),
    radius : radius,
    r : random(255),
    g : random(255),
    b : random(255)
  };

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
      theBall.dx = theBall.dx * -1;
      randomizeColor(theBall);
    }
    if (theBall.y < 0 + theBall.radius || theBall.y > height - theBall.radius) {
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
        // collides perfectly elastically, along the normal
        let normal = createVector(ball2.x-ball1.x, ball2.y-ball1.y);
        normal.normalize();
        let v1 = createVector(ball1.dx, ball1.dy);
        let v2 = createVector(ball2.dx, ball2.dy);
        // model 1d collision
        let v1Change = normal.mult(v2.dot(normal)-v1.dot(normal));
        let v2Change = normal.mult(v1.dot(normal)-v2.dot(normal));
        v1.add(v1Change);
        v2.add(v2Change);
        ball1.dx = v1.x;
        ball1.dy = v1.y;
        ball2.dx = v2.x;
        ball2.dy = v2.y;
        // randomizeColor(ball1);
        // randomizeColor(ball2);
      }
    }
  }
}


function showCircle() {
  for (let i=0; i<theBallArray.length; i++) {
    let theBall = theBallArray[i];
    fill(theBall.r, theBall.g, theBall.b);
    circle(theBall.x, theBall.y, theBall.radius*2)
  }
}

function randomizeColor(theBall) {
  theBall.r = random(255);
  theBall.g = random(255);
  theBall.b = random(255);
}

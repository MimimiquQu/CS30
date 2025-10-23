let theBallArray = [];
let numberOfParticles;
let maxSpeed = 5;
let distributionWidth = 0.5;
let colorDistributionMidpoint;
let boxWidth = 600;
let boxHeight = 600;
let particleMass = 1;
let plotDistributionPrecision = 100; // how many intervals to divide the speed/KE distribution graphs into
let plotDisplayWidth = 300;
let plotDisplayHeight = 200;

function setup() {
  colorDistributionMidpoint = (-1)*distributionWidth*log((1+exp((-1)/distributionWidth))/2);
  createCanvas(windowWidth, windowHeight);
  noStroke();
  angleMode(DEGREES);
  drawBox();
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


function spawnBall(x, y) {
  // let radius = random(25, 75);
  let radius = 3;
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

  theBallArray.push(newBall);
  numberOfParticles = theBallArray.length;
}

function moveCircle() {
  for (let i=0; i<theBallArray.length; i++) {
    let theBall = theBallArray[i];
    theBall.x = theBall.x + theBall.dx;
    theBall.y = theBall.y + theBall.dy;
  }
}

function drawBox() {
  color(255);
  stroke(1000);
  noFill();
  rect((width-boxWidth)/2,(height-boxHeight)/2, boxWidth, boxHeight);
  noStroke();
  fill(255);
}

function bounceEdge() {
  let leftEdge = (width-boxWidth)/2;
  let rightEdge = (width+boxWidth)/2;
  let topEdge = (height-boxHeight)/2;
  let bottomEdge = (height+boxHeight)/2;

  for (let i=0; i<theBallArray.length; i++) {
    let theBall = theBallArray[i];
    //should i bounce?
    if (theBall.x < leftEdge+theBall.radius || theBall.x > rightEdge - theBall.radius) {
      theBall.x = max(leftEdge+theBall.radius, min(theBall.x, rightEdge - theBall.radius));
      theBall.dx = theBall.dx * -1;
      // randomizeColor(theBall);
    }
    if (theBall.y < topEdge+theBall.radius || theBall.y > bottomEdge - theBall.radius) {
      theBall.y = max(topEdge+theBall.radius, min(theBall.y, bottomEdge - theBall.radius));
      theBall.dy = theBall.dy * -1;
      // randomizeColor(theBall);
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

        // change colors according to KE after collision
        // ball 1
        let ballKE = (sq(ball1.dx)+sq(ball1.dy))/(2*sq(maxSpeed));
        ball1.r = min(1,ballKE/colorDistributionMidpoint)*255;
        ball1.b = min(1,(1-ballKE)/(1-colorDistributionMidpoint))*255;
        ball1.g = 0.5*(1/colorDistributionMidpoint-1/(1-colorDistributionMidpoint))*ballKE-0.5*(1/colorDistributionMidpoint+1/(1-colorDistributionMidpoint))*abs(ballKE-colorDistributionMidpoint)+0.5/(1-colorDistributionMidpoint);
        // ball 2
        ballKE = (sq(ball2.dx)+sq(ball2.dy))/(2*sq(maxSpeed));
        ball2.r = min(1,ballKE/colorDistributionMidpoint)*255;
        ball2.b = min(1,(1-ballKE)/(1-colorDistributionMidpoint))*255;
        ball2.g = 0.5*(1/colorDistributionMidpoint-1/(1-colorDistributionMidpoint))*ballKE-0.5*(1/colorDistributionMidpoint+1/(1-colorDistributionMidpoint))*abs(ballKE-colorDistributionMidpoint)+0.5/(1-colorDistributionMidpoint);
       
      }
    }
  }
}


function showCircle() {
  for (let i=0; i<theBallArray.length; i++) {
    let theBall = theBallArray[i];
    // the kinetic energy of the ball
    
    fill(theBall.r, theBall.g, theBall.b);
    circle(theBall.x, theBall.y, theBall.radius*2);
  }
}

function plotValues() {
  let sumKE = 0;
  let sumSpeeds = 0;
  let speedDistribution = new Array(plotDistributionPrecision).fill(0);
  let kEDistribution = new Array(plotDistributionPrecision).fill(0);

  // Use a single loop to calculate average v and KE, and recording in an array.
  for (let ball of theBallArray) {
    let v = sqrt(sq(ball.dx)+sq(ball.dy));
    let kE = 0.5*particleMass*sq(v);
    // add up individual speeds/KEs to calculate average
    sumSpeeds+=v;
    sumKE+=kE;
    // record values
    // take the floor of "(thisValue)/(maxValue) and multipled by plotDistributionPrecision(the number of intervals in the plot)" as "the interval (thisValue) is in" -> increment by 1
    // I set the (maxValue) for speed as as 2*maxSpeed which is actually sqrt(2)*(maximum possible initial speed of a ball), because (maximum possible initial speed of a ball) = sqrt(sq(maxSpeed)+sq(maxSpeed)) = sqrt(2)*maxSpeed, and in collisions speeds can go higher than initial speeds. 
    // The sqrt(2) factor added on top of that is to give "buffer space" for speeds that are over the initial maximum possible speed.

    speedDistribution[min(plotDistributionPrecision-1, floor(v/(2*maxSpeed)*plotDistributionPrecision))] ++;
    // the same "buffer space" logic applies to KE as well.
    kEDistribution[min(plotDistributionPrecision-1, floor(kE/(2*particleMass*sq(maxSpeed))*plotDistributionPrecision))] ++;
    
  }
  let avrKE = sumKE/numberOfParticles;
  let avrSpeed = sumSpeeds/numberOfParticles;

  //display avr v and KE as text
  textAlign(LEFT);
  textSize(20);
  textStyle(NORMAL);
  textFont("Verdana");
  fill("white");
  text("Average Speed: "+avrSpeed.toFixed(3), width*0.05, height*0.8 - 50);
  text("Average Kinetic Energy: "+avrKE.toFixed(3), width*0.05, height*0.8 + 50);

  //display v,KE distribution via a graph
  // draw rectangles with height corresponding to frequency
  text("Speed Distribution", width*0.05, height*0.5 + 150);
  let peakFrq = findMax(speedDistribution, 1); // call this function to find the max(numerically largest) element within the array
  for (let i=0; i<plotDistributionPrecision; i++) {
    rect(width*0.05+i*(plotDisplayWidth)/(plotDistributionPrecision), height*0.5+130 - speedDistribution[i]*plotDisplayHeight/peakFrq, plotDisplayWidth/plotDistributionPrecision + 1, speedDistribution[i]*plotDisplayHeight/peakFrq);
  }

  text("Kinetic Energy Distribution", width*0.05, height*0.5 - 100);
  peakFrq = findMax(kEDistribution, 1);
  for (let i=0; i<plotDistributionPrecision; i++) {
    rect(width*0.05+i*(plotDisplayWidth)/(plotDistributionPrecision), height*0.5-120 - kEDistribution[i]*plotDisplayHeight/peakFrq, plotDisplayWidth/plotDistributionPrecision + 1, kEDistribution[i]*plotDisplayHeight/peakFrq);
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
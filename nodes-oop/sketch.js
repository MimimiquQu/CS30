// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let nodes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  connectCloseNodes();
  nodesLoop();
}

function mousePressed() {
  nodes.push(new MovingPoint(mouseX, mouseY));
}

class MovingPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xTime = random(10000);
    this.yTime = random(10000);
    this.deltaTime = 0.05;
    this.radius = random(5, 15);
    this.speed = random(1,5);
    this.color = color(random(255), random(255), random(255));
  }

  display() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.radius*2);
  }

  move() {
    let dx = noise(this.xTime);
    let dy = noise(this.yTime);
    
    // move point
    this.x += map(dx, 0, 1, -this.speed, this.speed);
    this.y += map(dy, 0, 1, -this.speed, this.speed);

    //increment time
    this.xTime += this.deltaTime;
    this.yTime += this.deltaTime;     
  }

  edgeWrap() {
    if (this.x-this.radius > width) {
      this.x = 0;
    }
    else if (this.x+this.radius < 0) {
      this.x = width;
    }
    if (this.y-this.radius > height) {
      this.y = 0;
    }
    else if (this.y+this.radius < 0) {
      this.y = height;
    }
  }
}

function nodesLoop() {
  for (let n of nodes) {
    n.display();
    n.move();
    n.edgeWrap();
  }
}


function connectCloseNodes() {
  stroke(0);
  for (let i=0; i<nodes.length; i++) {
    for (let j=i+1; j<nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < nodes[i].radius + nodes[j].radius + 100) {
        line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      }
    }
  }
}
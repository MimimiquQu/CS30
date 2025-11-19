// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.radius = 3;
    this.r = 255;
    this.g = 0;
    this.b = 0;
    this.opacity = 255;
    this.index = fireworks.length;
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.opacity);
    circle(this.x, this.y, this.radius * 2);
  }

  update() {
    //move
    this.x += this.dx;
    this.y += this.dy;
    
    // fade out
    this.opacity -= 1;

    // update index number
    this.index = fireworks.indexOf(this);
  }

  isDead() {
    if (this.opacity <= 0) {
      fireworks.splice(fireworks.indexOf(this.index), 1);
    }
  }
}

let fireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background("black");
  for (let f of fireworks) {
    f.update();
    f.display();
    f.isDead();
  }
}

function mousePressed() {
  for (let i = 0; i < 100; i++) {
    let fireworkParticle = new Particle(mouseX, mouseY);
    fireworks.push(fireworkParticle);
  }
}
// Shape Inheritance OOP

class Shape {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  display() {
    let mouseDist = dist(this.x, this.y, mouseX, mouseY);
    fill(this.color);
    noStroke();
  }

  move() {
    let mouseDist = dist(this.x, this.y, mouseX, mouseY);
    let speed = max(0, map(mouseDist, 0, 0.3*height, 20, 0));
    this.x += random(-speed, speed);
    this.y += random(-speed, speed);
  }
}

class Circle extends Shape {
  constructor(x, y, color, radius) {
    super(x, y, color);
    this.radius = radius;
  }

  display() {
    super.display();
    ellipse(this.x, this.y, this.radius*2);
  }
}

class Sqaure extends Shape {
  constructor(x, y, color, length) {
    super(x, y, color);
    this.length = length;
  }

  display() {
    super.display();
    rectMode(CENTER);
    rect(this.x, this.y, this.length, this.length);
  }
}

let shapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i=0; i<10000; i++) {
    let aColor = color(random(255), random(255), random(255));
    if (random(1) < 0.5) {
      shapes.push(new Circle(random(width), random(height), aColor, random(2, 10)));
    } else {
      shapes.push(new Sqaure(random(width), random(height), aColor, random(3, 15)));
    }
  }
}

function draw() {
  background(220);
  for (let s of shapes) {
    s.move();
    s.display();
  }
}

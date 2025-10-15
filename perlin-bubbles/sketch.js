// Perlin Bubbles Demo
// Noise, Arrays, and Project Notation

let bubbles = [];
const TIME_SPEED = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  spawnBubble();

  // add a new bubble per time interval
  window.setInterval(spawnBubble, 1000);
}

function draw() {
  background(255);
  showBubbles();
}

function spawnBubble() {
  fill(random(255),random(255),random(255));
  // temporary variables
  let _time = random(1000);
  let _buffer = random(1000);

  let bubble = {
    time : _time,
    buffer: _buffer,
    x : noise(_time) * width,
    y : noise(_time+_buffer) * height,
    diameter: random(20,50),
  };
  bubbles.push(bubble);
}

function showBubbles() {
  for (let bubble of bubbles) {
    bubble.x = noise(bubble.time)*width;
    bubble.y = noise(bubble.time+bubble.buffer)*height;
    circle(bubble.x, bubble.y, bubble.diameter);
    bubble.time += TIME_SPEED;
  }
}
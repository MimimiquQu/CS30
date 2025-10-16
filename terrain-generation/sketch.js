// Terrain Generation with Perlin Noise

let terrain = [];
let w = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  let rect = spawnRectangle(0,w,100);
  terrain.push(rect);
}

function draw() {
  background(220);
}

function spawnRectangle(x,w,h) {
  let rect = {
    x: x,
    y: height - h,
    w: w,
    h: h,
  };
  return rect;
}

function showRectangles() {
  for (let rect of terrain) {
    rect(rect.x, rect.y, rect.w, rect.h);
  }
}
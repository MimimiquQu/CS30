// Terrain Generation with Perlin Noise

let terrain = [];
let w = 1;
let time = 0;
let timeStep = 0.003;
let x=0;
let max_height;

function setup() {
  createCanvas(windowWidth, windowHeight);
  max_height = height*0.7;
  noStroke();
  generateTerrain();
}



function draw() {
  background(220);
  showRectangles();
}

function spawnRectangle(x,w,h) {
  let rectangle = {
    x: x,
    y: height - h,
    w: w,
    h: h,
  };
  return rectangle;
}

function showRectangles() {
  for (let rectangle of terrain) {
    fill(255-rectangle.h/max_height*255);
    rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
  }
}

function generateTerrain() {
  while (x <= width) {
    terrain.push(spawnRectangle(x, w, noise(time)*max_height));
    x+=w;
    time+=timeStep;
  }
  
}
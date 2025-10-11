// Generative Art Demo
// Tschumi Qu
// 10/9/2025
//
// Extra for Experts:

let tileSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  tileSize=width/100;
  drawTiles();
}

function draw() {
  background(220);
  drawTiles();
  
}

function drawTiles() {
  for (let x=0; x<width; x+=tileSize) {
    for (let y=0; y<height; y+=tileSize) {
      let tile = randomTile(x,y);
      line(tile.x1,tile.y1,tile.x2,tile.y2);
    }
  }
}
function randomTile(x,y) {
  let choice = random();
  let tile;
  if (choice<0.5) {
    tile = {
      x1: x,
      y1: y,
      x2: x+tileSize,
      y2: y+tileSize,
    }
  } else {
    tile = {
      x1: x,
      y1: y+tileSize,
      x2: x+tileSize,
      y2: y,
    }
  }
  return tile;
}

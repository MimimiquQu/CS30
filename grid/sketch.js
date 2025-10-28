//Grid Demo
// Learning 2d arrays

let grid;
let cellSize;
const SQUARE_DIMENSIONS = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellSize = min(height, width)/SQUARE_DIMENSIONS;
  grid = generateRandomGrid(SQUARE_DIMENSIONS, SQUARE_DIMENSIONS);
}

function draw() {
  background(220);
  showGrid();
}

function showGrid() {
  for (let x=0; x<SQUARE_DIMENSIONS; x++) {
    for (let y=0; y<SQUARE_DIMENSIONS; y++) {
      fill(255*(1-grid[y][x]));
      square(x*cellSize, y*cellSize, cellSize);
    }
  }
}

function toggleCell(x, y) {
  grid[y][x] = 1-grid[y][x];
}

function generateRandomGrid(rows, cols) {
  let newGrid = [];
  for (let y=0; y< rows; y++) {
    newGrid.push([]);
    for (let x=0; x<cols; x++) {
      newGrid[y].push(floor(random(0, 2)));
    }
  }
  return newGrid;
}


function mousePressed() {
  let x = floor(mouseX/cellSize);
  let y = floor(mouseY/cellSize);

  toggleCell(x, y);
}

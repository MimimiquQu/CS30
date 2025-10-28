// Rectangle Neighbors 2d Array Demo

const CELL_SIZE = 50;
let grid;
let rows;
let cols;
let isDrawing;


function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(height/CELL_SIZE);
  rows = floor(width/CELL_SIZE);
  grid = generateGrid(rows, cols);

}

function draw() {
  background(220);
  toggleCell();
  renderGrid();
  console.log(isDrawing);
}

function mousePressed() {
  isDrawing = true;
}

function mouseReleased() {
  isDrawing = false;
}

function keyPressed() {
  if (key === "r") {
    grid = generateGrid(rows, cols);
  }
  if (key === "e") {
    grid = emptyGrid(rows, cols);
  }
}

function toggleCell() {
 if (isDrawing) {
  let x = floor(mouseY/CELL_SIZE);
  let y = floor((mouseX)/CELL_SIZE);
  if (grid[y][x] === 1) {
    grid[y][x] = 0;
  } else if (grid[y][x] === 0) {
    grid[y][x] = 1;
  }
 }
}


function generateGrid(rows, cols) {
  let newGrid = [];
  for (let i=0; i<rows; i++) {
    newGrid.push([]);
    for (let j=0; j<cols; j++) {
      newGrid[i].push(floor(random(0,2)));
    }
  }
  return newGrid;
}

function emptyGrid(rows, cols) {
  let newGrid = [];
  for (let i=0; i<rows; i++) {
    newGrid.push([]);
    for (let j=0; j<cols; j++) {
      newGrid[i].push(0);
    }
  }
  return newGrid;
}
function renderGrid() {
  for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++) {
      fill(255*(1-grid[i][j]));
      square(i*CELL_SIZE, j*CELL_SIZE, CELL_SIZE);
    }
  }
}

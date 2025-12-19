// Recursion Visual Demo - Sierpinski Triangle

let init;
let length = 600;
let smallestSize = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  init = [{x: width/2-length/2, y: height/2+length/(2*sqrt(3))+100}, {x: width/2+length/2, y: height/2+length/(2*sqrt(3))}, {x: width/2, y: height/2-length/(sqrt(3))}];
  
  sierpinski(init);
  
}

function sierpinski(points) {
  console.log(points);
  if (dist(points[0].x, points[0].y, points[1].x, points[1].y) < smallestSize) {
    return;
  }
  triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y);
  sierpinski([points[0], midpoint(points[0], points[1]), midpoint(points[0], points[2])]);
  sierpinski([points[1], midpoint(points[0], points[1]), midpoint(points[1], points[2])]);
  sierpinski([points[2], midpoint(points[2], points[1]), midpoint(points[2], points[0])]);
}

function midpoint(point1, point2) {
  return {x: (point1.x + point2.x)/2, y: (point1.y + point2.y)/2};
}


function draw() {

}

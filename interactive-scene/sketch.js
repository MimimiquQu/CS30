// Racecar Game Project
// Tschumi Qu
// 09/29/2025
// Date

// Extra for Experts:
// - describe what you did to take this project "above and beyond"





let x = 0;
let y = 0;
let dx = 0;
let dy = 0;
let a = 0.2;
let ang_a = 1;
let c_r = 0.8;
let car_dir=-90;
let tire_dir=-90;
let v=0;
let c_fric = 0.03;

let car_width = 20;
let car_length = 40;
let car_phi;
let car_r;
let tire_width = 5;
let tire_diam = 10;
let tire_to_car_center_distance = 10;
let car_tire_r;
let car_tire_phi;
let tire_r;
let tire_phi;
let x1,x2,x3,x4,y1,y2,y3,y4;


function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  x = width / 2;
  y = height / 2;
  angleMode(DEGREES);
  car_phi = atan(car_width/car_length);
  car_r = sqrt(sq(car_width) + sq(car_length))/2;
  car_tire_r = sqrt(sq((tire_width+car_width)/2)+sq(tire_to_car_center_distance));
  car_tire_phi = atan((tire_width+car_width)/(2*tire_to_car_center_distance));
  tire_r = sqrt(sq(tire_diam) + sq(tire_width))/2;
  tire_phi = atan(tire_width/tire_diam);
}

function keyInput() {
  if (keyIsDown(87) === true) {
    v+=a;
  }
  if (keyIsDown(83) === true) {
    v -= a;
  }
  if (keyIsDown(68) === true) {
    tire_dir+=ang_a;
  }
  if (keyIsDown(65) === true) {
    tire_dir-= ang_a;
  }
}

function draw() {
  background(255);
  keyInput();
  // x += v*cos(car_dir);
  // y += v*sin(car_dir);
  draw_racecar();
  edge_collision();
  
}

function draw_racecar() {
  x1 = x + car_r*cos(car_dir-car_phi);
  y1 = y + car_r*sin(car_dir-car_phi);
  x2 = x + car_r*cos(car_dir+car_phi);
  y2 = y + car_r*sin(car_dir+car_phi);
  x3 = x + car_r*cos(car_dir-car_phi+180);
  y3 = y + car_r*sin(car_dir-car_phi+180);
  x4 = x + car_r*cos(car_dir+car_phi+180);
  y4 = y + car_r*sin(car_dir+car_phi+180);
  
  // draw tires
  fill("black");
  let angles = [90-car_tire_phi, 90+car_tire_phi, -90-car_tire_phi, -90+car_tire_phi];
  for (let i=0; i<4; i++) {
    draw_tire(angles[i]);
  }
  
  // draw car body
  fill("blue");
  quad(x1,y1,x2,y2,x3,y3,x4,y4);
  fill("red");
  quad(x1,y1,x2,y2,(4*x2+x3)/5,(4*y2+y3)/5, (4*x1+x4)/5, (4*y1+y4)/5);


}

function draw_tire(angle) {
  let x_center = car_tire_r*cos(angle+car_dir)+x;
  let y_center = car_tire_r*sin(angle+car_dir)+y;
  // circle(x_center,y_center, 2);
  quad(x_center + tire_r*cos(90-tire_phi+tire_dir),y_center + tire_r*sin(90-tire_phi+tire_dir), x_center + tire_r*cos(90+tire_phi+tire_dir),y_center + tire_r*sin(90+tire_phi+tire_dir), x_center + tire_r*cos(-90-tire_phi+tire_dir),y_center + tire_r*sin(-90-tire_phi+tire_dir), x_center + tire_r*cos(-90+tire_phi+tire_dir),y_center + tire_r*sin(-90+tire_phi+tire_dir));

}

function edge_collision() {
  if (min(x1,x2,x3,x4)<=0 || max(x1,x2,x3,x4)>=width) {
    v = -v*c_r;
  }
  if (min(y1,y2,y3,y4)<=0 || max(y1,y2,y3,y4)>=height) {
    v = -v*c_r;
  }
}

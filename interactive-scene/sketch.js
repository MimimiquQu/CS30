// Racecar Game Project
// Tschumi Qu
// 09/29/2025


// Extra for Experts:
// - describe what you did to take this project "above and beyond"


// Car/tires dimensions constants
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

// global variables to track car position, velocity, acceleration, direction, tire angle, throttle, brake, steering
let x = 0;
let y = 0;
let dx = 0;
let dy = 0;
let a = 0.2;
let v=0;
let c_r = 0.8;
let car_dir = 0;
let tire_dir = 0;
let steering_angle = tire_phi - car_phi;
let throttle = 0;
let brake = 0;

// constants for car movement, friction, etc.
let a_max = 5;
let b_max = -5;
let drag_coeff = 0.05;
let rr_coeff = 0.01;
let steering_rate = 1;

// global variables to draw the car.
let x1,x2,x3,x4,y1,y2,y3,y4;


function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  x = width / 2;
  y = height / 2;
  angleMode(DEGREES);
  car_phi = atan(car_width/car_length);
  car_r = sqrt(sq(car_width) + sq(car_length))/2;
  car_tire_r = sqrt(sq((tire_width+car_width)/2.5)+sq(tire_to_car_center_distance));
  car_tire_phi = atan((tire_width+car_width/1.25)/(2*tire_to_car_center_distance));
  tire_r = sqrt(sq(tire_diam) + sq(tire_width))/2;
  tire_phi = atan(tire_width/tire_diam);
}

function keyInput() {
  if (keyIsDown(87) === true) {
    brake = 0;
    if (throttle<= 0.9) throttle += 0.1;
    a = throttle*a_max;
  }
  if (keyIsDown(83) === true) {
    throttle = 0;
    if (brake<= 0.9) brake += 0.1;
    a = -brake*b_max;
  }
  if (keyIsDown(68) === true) {
    tire_dir+=steering_rate;
  }
  if (keyIsDown(65) === true) {
    tire_dir-= steering_rate;;
  }
}

function draw() {
  background(255);
  keyInput();
  v+=a;
  turn_car();
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
  let angles = [car_tire_phi, -car_tire_phi, 180+car_tire_phi,180-car_tire_phi];
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
  quad(x_center + tire_r*sin(90-tire_phi-tire_dir),y_center + tire_r*cos(90-tire_phi-tire_dir), x_center + tire_r*sin(90+tire_phi-tire_dir),y_center + tire_r*cos(90+tire_phi-tire_dir), x_center + tire_r*sin(-90-tire_phi-tire_dir),y_center + tire_r*cos(-90-tire_phi-tire_dir), x_center + tire_r*sin(-90+tire_phi-tire_dir),y_center + tire_r*cos(-90+tire_phi-tire_dir));

}

function turn_car() {

}
function edge_collision() {
  if (min(x1,x2,x3,x4)<=0 || max(x1,x2,x3,x4)>=width) {
    v = -v*c_r;
  }
  if (min(y1,y2,y3,y4)<=0 || max(y1,y2,y3,y4)>=height) {
    v = -v*c_r;
  }
}

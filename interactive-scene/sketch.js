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

// constants for car movement, friction, etc.
let a_max = 0.2;
let b_max = 0.2;
let drag_coeff = 0.002;
let rr_coeff = 0.003;
let steering_rate = 1;
let steering_angle_max = 40;
let steering_factor = 3;

// global variables to track car position, velocity, acceleration, direction, tire angle, throttle, brake, steering
let x = 0;
let y = 0;
let dx = 0;
let dy = 0;
let a = 0;
let v = 0;
let c_r = 1;
let car_dir = 0;
let tire_dir = 0;
let steering_angle = tire_phi - car_phi;
let throttle = 0;
let brake = 0;
// the direction variable is used to track whether the car is going forward or backward
let gear = 1;

// global variables to draw the car.
let x1,x2,x3,x4,y1,y2,y3,y4;


function setup() {
  createCanvas(700, 700);
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
  // hold "r" to switch to reverse gear
  if (keyIsDown(82) === true && v<=0.1 || v<=-0.1) {
    gear = -1;
  } else {
    gear = 1;
  } 
  if (keyIsDown(87) === true) {
    brake = 0;
    if (throttle<= 0.975) throttle += 0.05;
  }
  if (keyIsDown(83) === true) {
    throttle = 0;
    if (brake<= 0.975) brake += 0.05;
  }
  if (keyIsDown(68) === true) {
    if (steering_angle <= steering_angle_max - steering_rate) tire_dir+=steering_rate;
  }
  if (keyIsDown(65) === true) {
    if (steering_angle >= -steering_angle_max + steering_rate) tire_dir-=steering_rate;
  }
  if (throttle>=0.1) throttle-=0.025;
  if (brake>=0.1) brake-=0.025;
}

function draw() {
  background(200);
  keyInput();
  console.log(a);
  move_car();
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

function move_car() {
  // update the steering angle
  steering_angle = tire_dir - car_dir;
  // F=ma; the external forces present are throttle/brake, drag (pp to v^2), and rolling friction (pp to v)
  a = throttle*a_max*gear - brake*b_max*gear-drag_coeff*v*abs(v) -rr_coeff*v;
  // v = a*dt
  if ((v+a)*gear>=0) {
    v+=a;
  } else {
    v=0;
  }

  // Implement Turning
  // The turning radius R can be calculated as R=L/tan(steering_angle) with simple geometry, since by the rolling without slipping condition, the instantaneous center of turning must be the intersection of the perpendicular bisectors of the tires(front axle) and the car body.
  // turning the car based on this calculation:
  car_dir += (v/tire_to_car_center_distance)*tan(steering_angle)*steering_factor*1.5;
  tire_dir += (v/tire_to_car_center_distance)*tan(steering_angle)*steering_factor;
  // update the position of the car
  x += v*cos(car_dir);
  y += v*sin(car_dir);
}

function edge_collision() {
  if (min(x1,x2,x3,x4)<=0 || max(x1,x2,x3,x4)>=width) {
    v = -v*c_r;
  }
  if (min(y1,y2,y3,y4)<=0 || max(y1,y2,y3,y4)>=height) {
    v = -v*c_r;
  }
}

// Racecar Game Project
// Tschumi Qu
// 09/29/2025


// Extra for Experts:
// See Google Docs :)

// load sprites
let track_img;
let start_screen;

// Map/Car/tires dimensions constants
let map_scaling = 2;
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
let drag_coeff = 0.0002;
let rr_coeff = 0.00005;
let steering_rate = 1;
let steering_angle_max = 40;
let steering_factor = 2;
// static friction is proportional to v^2*tan(steering_angle), so we set a constant to limit this MAXIMUM of this quantity.
let fric_max = 10;

// global variables to track car position, velocity, acceleration, direction, tire angle, throttle, brake, steering
let x = 0;
let y = 0;
let dx = 0;
let dy = 0;
let a = 0;
let v = 0;
let c_r = 1;
let car_dir = -90;
let tire_dir = -90;
let steering_angle = tire_phi - car_phi;
let throttle = 0;
let brake = 0;
let fric;
let turning_radius;
// the direction variable is used to track whether the car is going forward or backward
let gear = 1;

// global variables to draw the car.
let x1,x2,x3,x4,y1,y2,y3,y4;

// state variables
let game_state = "start_screen";

function preload() {
  track_img = loadImage('racecar_map.png');
  start_screen = loadImage('start_screen.png');
}

// resize canvas
function windowResized() {
  // scale everything in the game accordingly
  let scale_vector = createVector(width/windowWidth, height/windowHeight);
  resizeCanvas(windowWidth, windowHeight);
  translate(width/2, height/2);
  scale(v);
  translate(-width/2, -height/2);
  
}

// setup canvas and initialize variables and whatnot
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  x = width/2;
  y = height/2;
  angleMode(DEGREES);
  car_phi = atan(car_width/car_length);
  car_r = sqrt(sq(car_width) + sq(car_length))/2;
  car_tire_r = sqrt(sq((tire_width+car_width)/2.5)+sq(tire_to_car_center_distance));
  car_tire_phi = atan((tire_width+car_width/1.25)/(2*tire_to_car_center_distance));
  tire_r = sqrt(sq(tire_diam) + sq(tire_width))/2;
  tire_phi = atan(tire_width/tire_diam);
}

// draw loop
function draw() {
  if (game_state === "start_screen") {
    start_screen_display();
  }
  if (game_state === "playing") {
    background(220);
    keyInput();
    move_car();
    camera_pan();
    // edge_collision();
  }

}

function start_screen_display() {
  image(start_screen, 0, 0, width, height);
  //  draw "start game" button
  fill("yellow");
  rect(4/5*width-100, 4/5*height-50, 200, 100);

  textAlign(CENTER, CENTER);
  textSize(40);
  fill("black");
  text("START", 4/5*width, 4/5*height);
  fill("white");
  textSize(20);
  textAlign(LEFT, CENTER);
  text("Controls:", width/20, height/2);
  text("W/S for gas/brake", width/20, height/2+50);
  text("A/D for steering", width/20, height/2+100);
  text("Hold R for reverse gear (Car must be at rest!)", width/20, height/2+150);
  textSize(40);
  fill("red");
  textAlign(CENTER, CENTER);
  text("COLLISIONS DO NOT EXIST!!!(YET)", width/2, height/15);

  if (mouseIsPressed && mouseX>4/5*width-100 && mouseX<4/5*width+100 && mouseY>4/5*height-50 && mouseY<4/5*height+50) {
    game_state = "playing";
  }
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


function camera_pan() {
  push();
  // set "camera" to the center of canvas, and rotate the entire canvas.
  translate(width/2, height/2);
  rotate(-car_dir-90);
  // translate so the car is at origin
  translate(-x, -y);
  // draw the map
  image(track_img, -width/2, -height/2, track_img.width*map_scaling, track_img.height*map_scaling);

  // draw the car with a separate push/pop pair so that when we rotate the car back to -90, it doesn't rotate the canvas altogether
  push();
  // set camera back to center and rotate the car
  translate(x, y);
  // rotate(car_dir+90);
  translate(-x,-y);
  draw_racecar();
  pop();

  pop();
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
  // I wanted to implement a Maximal Friction condition, but it doesn't seem to work well and makes the car behave very wierdly, so I'm commenting it out tfor now.
  // fric = sq(v)*tan(steering_angle);
  // if (abs(fric)>fric_max) {
  //   turning_radius = sq(v)/fric_max * (steering_angle>0 ? 1 : -1); // the last part with the "? :" is for checking what sign should turning_radius be. Theoretically, it's a positive number by definition, but here we're using it kind of like a vector.
  // } else {
  //   turning_radius = tire_to_car_center_distance/tan(steering_angle);
  // }

  turning_radius = tire_to_car_center_distance/tan(steering_angle);

  car_dir += v/turning_radius*steering_factor*1.5;
  tire_dir += v/turning_radius*steering_factor;
  // update the position of the car
  x += v*cos(car_dir);
  y += v*sin(car_dir);
}


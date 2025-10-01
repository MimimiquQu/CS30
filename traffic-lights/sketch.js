// Traffic Light Starter Code
// Your Name Here
// The Date Here

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/#/p5/millis

let state = "green"; //possible states: "green", "yellow", "red"

// The setup function runs once at the beginning
function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255);
  drawOutlineOfLights();
  changeStates();
  drawLights();
}

function changeStates() {
  if (millis() % 6000 < 2000) {
    state = "green"; // green for 2 seconds
  } else if (millis() % 6000 < 4000) {
    state = "yellow"; // yellow for 2 seconds
  } else {
    state = "red"; // red for 2 seconds
  }
}

function drawOutlineOfLights() {
  //box
  rectMode(CENTER);
  fill(0);
  rect(width/2, height/2, 75, 200, 10);

  //lights
  fill(255);
}

function drawLights() {
    if (state === "green") {
    fill(0, 255, 0);
  }
  ellipse(width/2, height/2 - 65, 50, 50); //top
  fill(255);
  if (state === "yellow") {
    fill(255, 255, 0);
  }
  ellipse(width/2, height/2, 50, 50); //middle
  fill(255);
  if (state === "red") {
    fill(255, 0, 0);
  }
  ellipse(width/2, height/2 + 65, 50, 50); //bottom
  fill(255);
}
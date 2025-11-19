// OOP Inheritance

class Unit {
  constructor(index, type) {
    this.index = index;
    this.type = type;
  }

  train() {
    console.log("Training unit #" + (this.index+1) + " of type " + this.type);
  }
}

class Footman extends Unit {
  constructor(index) {
    super(index, 'footman')
  }

  train() {
    console.log("A footman costs 135 gold and 2 food.");
    super.train();
  }
}

let u1 = new Unit(0, 'footman');
let f1 = new Footman(1);

function setup() {
  createCanvas(windowWidth, windowHeight);
  u1.train();
  f1.train();
}

function draw() {
  background(220);
}

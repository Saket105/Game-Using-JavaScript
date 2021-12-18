const canvas = document.createElement("canvas");

document.querySelector(".myGame").appendChild(canvas);

canvas.width = innerWidth;
canvas.height = innerHeight;

const context = canvas.getContext("2d");

playerPosition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;

    context.fill();
  }
}

const saket = new Player(playerPosition.x, playerPosition.y, 15, "blue");

saket.draw();

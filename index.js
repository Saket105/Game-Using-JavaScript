// Basic Environment Setup

const canvas = document.createElement("canvas");

document.querySelector(".myGame").appendChild(canvas);

canvas.width = innerWidth;
canvas.height = innerHeight;

const context = canvas.getContext("2d");

let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");


// Basic Functions

// Event Listener for difficulty
document.querySelector("input").addEventListener("click", (e) => {
  e.preventDefault();

  // making form invisible
  form.style.display = "none";

  // making scoreboard visible
  scoreBoard.style.display = "block";

  // getting difficulty selected by user
  const userValue = document.getElementById("difficulty").value;
  if (userValue === "Easy") {
    setInterval(spawnEnemy, 2000);
    return (difficulty = 3);
  }
  if (userValue === "Medium") {
    setInterval(spawnEnemy, 1500);
    return (difficulty = 6);
  }
  if (userValue === "Hard") {
    setInterval(spawnEnemy, 1000);
    return (difficulty = 9);
  }
  if (userValue === "Insane") {
    setInterval(spawnEnemy, 800);
    return (difficulty = 12);
  }
});

// --------------------------------------------------------------------------------------------

// ---------------------creating player, enemy, weapon, etc classes-----------------

// setting player position to centre
playerPosition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

// creating player class
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

// creating weapon class
class Weapon {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
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

  update() {
    this.draw();
    (this.x += this.velocity.x), (this.y += this.velocity.y);
  }
}

// creating enemy class

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
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

  update() {
    this.draw();
    (this.x += this.velocity.x), (this.y += this.velocity.y);
  }
}

// ---------------------- Main Logic Here --------------------------------------


// Creating player object, weapons array, enemy array, etc array
const saket = new Player(playerPosition.x, playerPosition.y, 15, "white");

const weapons = [];
const enemies = [];

// --------------------Function to spawn enemy at random location-----------------

const spawnEnemy = () => {
  // generating random size for enemy
  const enemySize = Math.random() * (40 - 5) + 5;

  // generating random color for enemy
  const enemyColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;

  // Random enemy spawn position
  let random;

  // Making enemy location random but only from outside of screen
  if (Math.random() < 0.5) {
    
    // Making x equal to very left off the screen or very right off the screen and setting Y to any where vertically
    random = {
      x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
      y: Math.random() * canvas.height,
    };
  } else {
    // Making Y equal to very UP off the screen or very DOWN off the screen and setting X to any where horizontally

    random = {
      x: Math.random() * canvas.width,
      y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
    };
  }

  // Finding angle between centre (means Player Position) and enemy position
  const myAngle = Math.atan2(
    canvas.height / 2 - random.y,
    canvas.width / 2 - random.x
  );

  // Making velocity or speed of enemy by multiplying chosen difficulty to radian
  const velocity = {
    x: Math.cos(myAngle) * difficulty,
    y: Math.sin(myAngle) * difficulty,
  };

  // Adding enemy to enemies array
  enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity));
};

// ------------------Creating Animation Functions----------------------

let animationId;
function animation() {
  // making recursion
  animationId = requestAnimationFrame(animation);

  // clearing canvas on each frame
  context.fillStyle = "rgba(49,49,49,0.2)";

  context.fillRect(0, 0, canvas.width, canvas.height);

  // context.clearRect(0, 0, canvas.width, canvas.height);
  // drawing Player
  saket.draw();

  // generating bullets
  weapons.forEach((weapon, weaponIndex) => {
    // weapon.draw();
    weapon.update();

    if (
      weapon.x + weapon.radius < 1 ||
      weapon.y + weapon.radius < 1 ||
      weapon.x - weapon.radius > canvas.width ||
      weapon.y - weapon.radius > canvas.height
    ) {
      weapons.splice(weaponIndex, 1);
    }
  });

  // generating enemies
  enemies.forEach((enemy, enemyIndex) => {
    // enemy.draw();
    enemy.update();

    const distanceBetweenPlayerAndEnemy = Math.hypot(
      saket.x - enemy.x,
      saket.y - enemy.y
    );

    if (distanceBetweenPlayerAndEnemy - saket.radius - enemy.radius < 1) {
      // console.log("Game Over");
      cancelAnimationFrame(animationId);
    }

    weapons.forEach((weapon, weaponIndex) => {
      const distanceBetweenWeaponAndEnemy = Math.hypot(
        weapon.x - enemy.x,
        weapon.y - enemy.y
      );

      if (distanceBetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1) {
        if (enemy.radius > 18) {
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            weapons.splice(weaponIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            enemies.splice(enemyIndex, 1);
            weapons.splice(weaponIndex, 1);
          }, 0);
        }
      }
    });
  });
}

// setInterval(spawnEnemy, 1000);

// ---------------------Adding Event Listeners--------------------------------------

// event listner for light weapon
canvas.addEventListener("click", (e) => {
  // finding angle between player position(centre) and click co-ordinates
  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );

  // Making const speed for light weapon
  const velocity = {
    x: Math.cos(myAngle) * 6,
    y: Math.sin(myAngle) * 6,
  };

  // Adding bullets in weapons array
  weapons.push(
    new Weapon(canvas.width / 2, canvas.height / 2, 6, "white", velocity)
  );
});

animation();

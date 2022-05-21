//Grabs canvas element and stores it inside variable
const canvas = document.querySelector("canvas");
const canCon = canvas.getContext("2d");

// Rezise canvas
canvas.width = 1024;
canvas.height = 576;

// Calls the canvas API and change the color of the canvas
canCon.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background2.png",
});

const woman = new Sprite({
  position: {
    x: 570,
    y: 430,
  },
  imageSrc: "./img/woman-idle.png",
  scale: 2,
  totalFrames: 7,
});

// Creates a new object form the Sprite class, player and enemy for this project
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/Evil-Wizard-2/Idle.png",
  scale: 2,
  totalFrames: 8,
  offset: {
    x: 200,
    y: 165,
  },
  sprites: {
    idle: {
      imageSrc: "./img/Evil-Wizard-2/Idle.png",
      totalFrames: 8,
    },
    run: {
      imageSrc: "./img/Evil-Wizard-2/Run.png",
      totalFrames: 8,
    },
    runBack: {
      imageSrc: "./img/Evil-Wizard-2/Run-Backwards.png",
      totalFrames: 8,
    },
    jump: {
      imageSrc: "./img/Evil-Wizard-2/Jump.png",
      totalFrames: 2,
    },
    fall: {
      imageSrc: "./img/Evil-Wizard-2/Fall.png",
      totalFrames: 2,
    },
    attack1: {
      imageSrc: "./img/Evil-Wizard-2/Attack2.png",
      totalFrames: 8,
    },
    takeHit: {
      imageSrc: "./img/Evil-Wizard-2/Take-hit.png",
      totalFrames: 3,
    },
    death: {
      imageSrc: "./img/Evil-Wizard-2/Death.png",
      totalFrames: 7,
    },
  },
  attackBox: {
    offset: {
      x: 80,
      y: 50,
    },
    width: 250,
    height: 150,
  },
});

const enemy = new Fighter({
  position: {
    x: 800,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/Huntress-2/Idle.png",
  scale: 2,
  totalFrames: 8,
  offset: {
    x: 200,
    y: -30,
  },
  sprites: {
    idle: {
      imageSrc: "./img/Huntress-2/Idle.png",
      totalFrames: 10,
    },
    run: {
      imageSrc: "./img/Huntress-2/Run.png",
      totalFrames: 8,
    },
    runBack: {
      imageSrc: "./img/Huntress-2/Run-Backwards.png",
      totalFrames: 8,
    },
    jump: {
      imageSrc: "./img/Huntress-2/Jump.png",
      totalFrames: 2,
    },
    fall: {
      imageSrc: "./img/Huntress-2/Fall.png",
      totalFrames: 2,
    },
    attack1: {
      imageSrc: "./img/Huntress-2/Attack.png",
      totalFrames: 6,
    },
    takeHit: {
      imageSrc: "./img/Huntress-2/Get-Hit-Left.png",
      totalFrames: 3,
    },
    death: {
      imageSrc: "./img/Huntress-2/Death-Left.png",
      totalFrames: 10,
    },
  },
  attackBox: {
    offset: {
      x: -220,
      y: 75,
    },
    width: 130,
    height: 50,
  },
});

console.log(player);

// Sets the value of the propertie pressed to decide if the key is pressed or not
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

decraseTimer();

function anime() {
  // Defines what function needs to be loop through
  window.requestAnimationFrame(anime);
  // Called so player an enemy can be diferentiated from the background
  canCon.fillStyle = "black";
  canCon.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  woman.update();
  canCon.fillStyle = 'rgba(255, 255, 255, 0.08)'
  canCon.fillRect(0,0, canvas.width, canvas.height)
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //Player movement
  if (keys.a.pressed && player.lastPressedKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("runBack");
  } else if (keys.d.pressed && player.lastPressedKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  //Jumping animation for player
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastPressedKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastPressedKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("runBack");
  } else {
    enemy.switchSprite("idle");
  }

  //Jumping animation for enemy
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // Detect player attack collisions and hits
  if (
    attackCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.currentFrame === 6
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    // Selects the enemy healt id to subtrack to it when enemy is hit
    gsap.to('#enemyHealth', {
      width: enemy.health + "%"
    })
  }

  // Detects lack of collision with the enemy
  if (player.isAttacking && player.currentFrame === 6) {
    player.isAttacking = false;
  }

  // Detect enemy attack collisions and hits
  if (
    attackCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.currentFrame === 4
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    // Selects the player healt id to subtrack to it when player is hit
    gsap.to('#playerHealth', {
      width: player.health + "%"
    })
  }

  // Detects lack of collision with the player
  if (enemy.isAttacking && enemy.currentFrame === 4) {
    enemy.isAttacking = false;
  }

  // End the game when health is 0
  if (enemy.health <= 0 || player.health <= 0) {
    declareWinner({ player, enemy, timerId });
  }
}

anime();

// 'listens' for a keydown event to generate movement once key is pressed down
window.addEventListener("keydown", (event) => {
  if (!player.death) {
    // Grabs the key being pressed and add a value to the velocity to make a movement
    switch (event.key) {
      case "a":
        keys.a.pressed = true;
        player.lastPressedKey = "a";
        break;
      case "d":
        keys.d.pressed = true;
        player.lastPressedKey = "d";
        break;
      case " ":
        player.attack();
        break;
      // Changes the players 'y' velocity to add a jump effect
      case "w":
        player.velocity.y = -12;
        break;
    }
  }

  if (!enemy.death) {
    switch (event.key) {
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastPressedKey = "ArrowLeft";
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastPressedKey = "ArrowRight";
        break;
      // Changes the enemy 'y' velocity to add a jump effect
      case "ArrowUp":
        enemy.velocity.y = -12;
        break;
      case "0":
        enemy.attack();
        break;
    }
  }
});

// 'listens' for a keyup event to generate stop movement once key is relased
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});

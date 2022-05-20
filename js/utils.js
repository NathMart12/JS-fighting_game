// Defines how an attack and collision should behave
function attackCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
  }
  
  function declareWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector("#displayText").style.display = "flex";
    if (player.health === enemy.health) {
      document.querySelector("#displayText").innerHTML = "Draw";
    } else if (player.health > enemy.health) {
      document.querySelector("#displayText").innerHTML = "Player 1 Wins";
    } else if (player.health < enemy.health) {
      document.querySelector("#displayText").innerHTML = "Player 2 Wins";
    }
  }
  
  // Defines the value and function for the timer
  let timer = 60;
  let timerId;
  function decraseTimer() {
    // -- means that timer is subtracting 1 from itself
    if (timer > 0) {
      // Creates the loop to call the code needed to decrease the timer
      timerId = setTimeout(decraseTimer, 1000);
      timer--;
      // Gets a hold of the element inside the div with the timer id and sets it's value to the current timer
      document.querySelector("#timer").innerHTML = timer;
    }
    if (timer === 0) {
      declareWinner(player, enemy, timerId);
    }
  }
import { Game } from "./game";

document.addEventListener("DOMContentLoaded", () => {
  // Get references to the start screen and start button
  const startScreen = document.getElementById("startScreen");
  const startButton = document.getElementById("startButton");
  const deathScreen = document.getElementById("deathScreen");
  const tryAgainButton = document.getElementById("tryAgainBtn");

  let game: Game | null = null;
  let tryAgainButtonClicked = false;

  // Function to hide the start screen and start the game
  function startGame() {
    startScreen?.classList.add("hidden");
    startScreen?.classList.remove("screen");
    deathScreen?.classList.add("hidden");
    deathScreen?.classList.remove("screen");

    if (!game) {
      game = new Game();
    } else if (game && tryAgainButtonClicked) {
      game.resetGame();
    }
  }

  // Function to reset the game and show the start screen
  function tryAgain() {
    deathScreen?.classList.add("hidden");
    deathScreen?.classList.remove("screen");
    tryAgainButtonClicked = true;
    startScreen?.classList.add("screen");
    startScreen?.classList.remove("hidden");
  }

  // Add click event listeners
  startButton?.addEventListener("click", startGame);
  tryAgainButton?.addEventListener("click", tryAgain);
});

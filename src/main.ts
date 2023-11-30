import { Game } from "./game";

document.addEventListener("DOMContentLoaded", () => {
  // Get references to the start screen and start button
  const startScreen = document.getElementById("startScreen");
  const startButton = document.getElementById("startButton");

  // Function to hide the start screen and start the game
  function startGame() {
    startScreen?.classList.add("hidden");
    startScreen?.classList.remove("startingScreenOverlay");

    // Initialize the game
    const game = new Game();
  }

  // Add a click event listener to the start button
  startButton?.addEventListener("click", startGame);
});

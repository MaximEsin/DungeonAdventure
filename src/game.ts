import * as PIXI from "pixi.js";

// Create PIXI application
const app = new PIXI.Application({
  width: 1200,
  height: 600,
  backgroundColor: 0x000000,
});
document.body.appendChild(app.view as unknown as Node);

// Load the knight texture
const knightTexture = PIXI.Texture.from("images/knight.png");

// Create a player character using the knight texture
const player = new PIXI.Sprite(knightTexture);
const playerWidth = 100;
const playerHeight = 100;
player.width = playerWidth;
player.height = playerHeight;

player.anchor.set(0.5); // Center the anchor point
player.x = 60;
player.y = 550;
app.stage.addChild(player);

// Set the speed of player movement
const playerSpeed = 5;

// Define the type for the keys object
interface Keys {
  [key: string]: boolean;
}

// Keyboard input handling
const keys: Keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

// Event listeners for keydown and keyup events
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Handle keydown event
function handleKeyDown(event: KeyboardEvent) {
  if (event.key in keys) {
    keys[event.key] = true;
  }
}

// Handle keyup event
function handleKeyUp(event: KeyboardEvent) {
  if (event.key in keys) {
    keys[event.key] = false;
  }
}

// Game loop
app.ticker.add(() => {
  // Update player position based on keyboard input
  if (keys.w) {
    if (player.y < app.screen.height - 550) {
      return;
    }
    player.y -= playerSpeed;
  }
  if (keys.a) {
    if (player.x < 50) {
      return;
    }
    player.x -= playerSpeed;
  }
  if (keys.s) {
    if (player.y > app.screen.height - 50) {
      return;
    }
    player.y += playerSpeed;
  }
  if (keys.d) {
    if (player.x > app.screen.width - 55) {
      return;
    }
    player.x += playerSpeed;
  }
});

import * as PIXI from "pixi.js";

// Create PIXI application
const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
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

// Game loop
app.ticker.add(() => {});

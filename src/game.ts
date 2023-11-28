import * as PIXI from "pixi.js";
import { Player } from "./entities/player";
import { Enemy } from "./entities/enemy";
import { PlayerStats } from "./interfaces/playerStats";

// Game class
class Game {
  public app: PIXI.Application;
  public player: Player;
  private enemy: Enemy;

  constructor() {
    // Create PIXI application
    this.app = new PIXI.Application({
      width: 1200,
      height: 600,
      backgroundColor: 0x000000,
    });
    document.body.appendChild(this.app.view as unknown as Node);

    // Init player and enemy
    this.player = new Player(this.app);
    this.enemy = new Enemy(this.app, this.player);
    this.setupInput();
    this.setupGameLoop();
  }

  // Add event listeners
  private setupInput(): void {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.player.handleKeyDown(event);
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.player.handleKeyUp(event);
  }

  private setupGameLoop(): void {
    this.app.ticker.add(() => {
      this.player.update();
      this.enemy.update();
    });
  }
}
const game = new Game();

// Get the interface elements
const playerNameElement = document.getElementById(
  "name"
) as HTMLParagraphElement;
const healthElement = document.getElementById("health") as HTMLParagraphElement;
const damageElement = document.getElementById("damage") as HTMLParagraphElement;
const armorElement = document.getElementById("armor") as HTMLParagraphElement;

// Function to update the interface with player's stats
function updateInterface(playerStats: PlayerStats): void {
  playerNameElement.textContent = `Max`;
  healthElement.textContent = `Health: ${playerStats.health}`;
  damageElement.textContent = `Damage: ${playerStats.damage}`;
  armorElement.textContent = `Armor: ${playerStats.armor}`;
}

// Call the function initially to display the initial stats
updateInterface(game.player.getStats());

// Add a listener to the ticker to update the interface on each frame
game.app.ticker.add(() => {
  updateInterface(game.player.getStats());
});

import * as PIXI from "pixi.js";
import { Player } from "./entities/player";
import { Enemy } from "./entities/enemy";

// Game class
class Game {
  private app: PIXI.Application;
  private player: Player;
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

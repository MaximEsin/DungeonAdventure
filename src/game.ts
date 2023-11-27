import * as PIXI from "pixi.js";
import { Player } from "./entities/player";

// Game class
class Game {
  private app: PIXI.Application;
  private player: Player;

  constructor() {
    // Create PIXI application
    this.app = new PIXI.Application({
      width: 1200,
      height: 600,
      backgroundColor: 0x000000,
    });
    document.body.appendChild(this.app.view as unknown as Node);

    // Init player
    this.player = new Player(this.app);
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
    });
  }
}
const game = new Game();

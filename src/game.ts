import * as PIXI from "pixi.js";
import { Player } from "./entities/player";
import { Enemy } from "./entities/enemy";
import { InterfaceManager } from "./UI/interfaceManager";

// Game class
export class Game {
  public app: PIXI.Application;
  public player: Player;
  private enemy!: Enemy;
  public enemies: Enemy[] = [];
  private interfaceManager: InterfaceManager;

  constructor() {
    // Create PIXI application
    this.app = new PIXI.Application({
      width: 1200,
      height: 600,
      backgroundColor: 0x000000,
    });
    document.body.appendChild(this.app.view as unknown as Node);

    // Init player and enemy
    this.player = new Player(this.app, this);
    this.createEnemy();
    this.setupInput();
    this.setupGameLoop();

    // Initialize the interface manager
    this.interfaceManager = new InterfaceManager();
  }

  private createEnemy(): void {
    const enemy = new Enemy(this.app, this.player, this);
    this.enemies.push(enemy);
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
      for (const enemy of this.enemies) {
        enemy.update();
      }

      // Update the interface on each frame
      this.interfaceManager.updateInterface(this.player.getStats());
    });
  }
}
const game = new Game();

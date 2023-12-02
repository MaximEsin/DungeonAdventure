import * as PIXI from "pixi.js";
import { Player } from "./entities/player";
import { Enemy } from "./entities/enemy";
import { InterfaceManager } from "./UI/interfaceManager";

// Game class
export class Game {
  public app: PIXI.Application;
  public player: Player;
  public enemy!: Enemy;
  public enemies: Enemy[] = [];
  private interfaceManager: InterfaceManager;

  constructor() {
    // Create PIXI application
    this.app = new PIXI.Application({
      width: 1200,
      height: 600,
      transparent: true,
    } as any);

    // Load the background image
    const backgroundImage = PIXI.Sprite.from(
      "images/backgrounds/BackWildWest.png"
    ); // Replace with the path to your image
    backgroundImage.width = this.app.screen.width;
    backgroundImage.height = this.app.screen.height;

    // Add the background image to the stage
    this.app.stage.addChild(backgroundImage);

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

  public resetGame(): void {
    // Reset player and enemy positions, stats, and any other relevant game state
    this.player.reset();
    this.enemies.forEach((enemy) => enemy.reset());

    // Show the initial interface
    this.interfaceManager.updateInterface(this.player.getStats());
  }
}

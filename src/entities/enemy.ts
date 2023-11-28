import * as PIXI from "pixi.js";
import { Player } from "./player";

// Enemy class
export class Enemy {
  private frames: PIXI.Texture[];
  private animatedSprite: PIXI.AnimatedSprite;
  private enemySpeed: number;
  private app: PIXI.Application;
  private player: Player;
  private shouldMove: boolean = true;

  constructor(app: PIXI.Application, player: Player) {
    this.app = app;
    this.enemySpeed = 1;
    this.player = player;

    // Load frames for enemy animation
    this.frames = [
      PIXI.Texture.from("images/knight/standing/knight_standing1.png"),
    ];

    this.animatedSprite = new PIXI.AnimatedSprite(this.frames);
    this.animatedSprite.width = 100; // Adjust width as needed
    this.animatedSprite.height = 100; // Adjust height as needed
    this.animatedSprite.anchor.set(0.5);

    // Set the initial position near the top border or right border
    if (Math.random() < 0.5) {
      // Spawn near the top border
      this.animatedSprite.x = this.getRandomPosition(this.app.screen.width);
      this.animatedSprite.y = 50;
    } else {
      // Spawn near the right border
      this.animatedSprite.x = this.app.screen.width - 50;
      this.animatedSprite.y = this.getRandomPosition(this.app.screen.height);
    }

    this.animatedSprite.animationSpeed = 0.2;
    this.animatedSprite.play();

    app.stage.addChild(this.animatedSprite);
  }

  private getRandomPosition(max: number): number {
    return Math.random() * max;
  }

  public update(): void {
    // Calculate direction to the player
    const directionX = this.player.animatedSprite.x - this.animatedSprite.x;
    const directionY = this.player.animatedSprite.y - this.animatedSprite.y;

    // Calculate the total distance to the player
    const distance = Math.sqrt(
      directionX * directionX + directionY * directionY
    );

    // Normalize the direction to get a unit vector
    const normalizedDirectionX = directionX / distance;
    const normalizedDirectionY = directionY / distance;

    // Check if the enemy is close to the player
    const proximityThreshold = 50;

    // Check if the enemy is close to the player
    if (distance < proximityThreshold) {
      // Calculate the stopping position without overlapping with the player
      const stopX =
        this.player.animatedSprite.x -
        normalizedDirectionX * proximityThreshold;
      const stopY =
        this.player.animatedSprite.y -
        normalizedDirectionY * proximityThreshold;

      // Set the enemy's position to the calculated stopping position
      this.animatedSprite.x = stopX;
      this.animatedSprite.y = stopY;

      this.shouldMove = false; // Stop moving when reaching the player
    } else if (!this.shouldMove) {
      // If the player moved, resume following
      this.shouldMove = true;
    }

    if (this.shouldMove) {
      // Move the enemy towards the player
      this.animatedSprite.x += normalizedDirectionX * this.enemySpeed;
      this.animatedSprite.y += normalizedDirectionY * this.enemySpeed;
    }
  }
  public resumeMovement(): void {
    this.shouldMove = true;
  }
}

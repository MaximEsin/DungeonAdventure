import * as PIXI from "pixi.js";
import { Player } from "./player";

// Enemy class
export class Enemy {
  private frames: PIXI.Texture[];
  private animatedSprite: PIXI.AnimatedSprite;
  private enemySpeed: number;
  private app: PIXI.Application;
  private player: Player;

  constructor(app: PIXI.Application, player: Player) {
    this.app = app;
    this.enemySpeed = 3;
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

    // Move the enemy towards the player
    this.animatedSprite.x += normalizedDirectionX * this.enemySpeed;
    this.animatedSprite.y += normalizedDirectionY * this.enemySpeed;
  }
}

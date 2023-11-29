import * as PIXI from "pixi.js";
import { Player } from "./player";
import { EnemyStats } from "../interfaces/enemyStats";
import { Game } from "../game";

// Enemy class
export class Enemy {
  private frames: PIXI.Texture[];
  public animatedSprite: PIXI.AnimatedSprite;
  private deathFrames: PIXI.Texture[];
  private enemySpeed: number;
  private app: PIXI.Application;
  private player: Player;
  private shouldMove: boolean = true;
  public stats: EnemyStats;
  private game: Game;
  private isAttacking: boolean = false;
  private attackInterval: number = 1000;
  private lastAttackTime: number = 0;
  private attackingFrames: PIXI.Texture[];
  private facingRight: boolean = true;

  constructor(app: PIXI.Application, player: Player, game: Game) {
    this.app = app;
    this.enemySpeed = 2;
    this.player = player;
    this.game = game;

    this.stats = {
      health: 40,
      maxHealth: 40,
      damage: 40,
      armor: 10,
    };

    // Load frames for enemy animation
    this.frames = [
      PIXI.Texture.from("images/berserk/move/run1.png"),
      PIXI.Texture.from("images/berserk/move/run2.png"),
      PIXI.Texture.from("images/berserk/move/run3.png"),
      PIXI.Texture.from("images/berserk/move/run4.png"),
      PIXI.Texture.from("images/berserk/move/run5.png"),
      PIXI.Texture.from("images/berserk/move/run6.png"),
    ];

    // Load frames for attacking animation
    this.attackingFrames = [
      PIXI.Texture.from("images/berserk/attack/attack1.png"),
      PIXI.Texture.from("images/berserk/attack/attack2.png"),
      PIXI.Texture.from("images/berserk/attack/attack3.png"),
      PIXI.Texture.from("images/berserk/attack/attack4.png"),
    ];

    // Load frames for death animation
    this.deathFrames = [
      PIXI.Texture.from("images/berserk/dead/dead1.png"),
      PIXI.Texture.from("images/berserk/dead/dead2.png"),
      PIXI.Texture.from("images/berserk/dead/dead3.png"),
      PIXI.Texture.from("images/berserk/dead/dead4.png"),
    ];

    this.animatedSprite = new PIXI.AnimatedSprite(this.frames);
    this.animatedSprite.width = 150; // Adjust width as needed
    this.animatedSprite.height = 150; // Adjust height as needed
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

  public getStats(): EnemyStats {
    return { ...this.stats }; // Return a copy to prevent direct modification
  }

  public takeDamage(amount: number): void {
    // Apply damage to the enemy, considering armor
    const damageTaken = Math.max(amount - this.stats.armor, 0);
    this.stats.health -= damageTaken;

    if (this.stats.health <= 0) {
      // Enemy is defeated, handle accordingly (e.g., increase player's score)
      this.playDeathAnimation();
      this.stats.health = 0;
    }
  }

  private playDeathAnimation(): void {
    // Stop any ongoing animations
    this.animatedSprite.stop();

    // Set death animation frames
    this.animatedSprite.textures = this.deathFrames; // Assuming you have frames for death animation

    // Set animation speed and play the death animation
    this.animatedSprite.animationSpeed = 0.2;
    this.animatedSprite.loop = false;
    this.animatedSprite.play();

    // Disable enemy movement
    this.shouldMove = false;
  }

  private getRandomPosition(max: number): number {
    return Math.random() * max;
  }

  public update(): void {
    if (this.stats.health <= 0) {
      // If the enemy is already dead, do nothing
      return;
    }
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
    const proximityThreshold = 60;

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

      // Check if it's time to attack
      const currentTime = performance.now();
      if (
        !this.isAttacking &&
        currentTime - this.lastAttackTime >= this.attackInterval
      ) {
        this.isAttacking = true;
        this.lastAttackTime = currentTime;

        // Call the function to perform the attack
        this.attackPlayer();
      }
    } else if (!this.shouldMove) {
      // If the player moved, resume following
      this.shouldMove = true;
      this.isAttacking = false; // Stop attacking when resuming movement

      // If enemy was attacking, return to moving animation
      if (this.animatedSprite.textures === this.attackingFrames) {
        this.playMovingAnimation();
      }
    }

    if (this.shouldMove) {
      // Move the enemy towards the player
      this.animatedSprite.x += normalizedDirectionX * this.enemySpeed;
      this.animatedSprite.y += normalizedDirectionY * this.enemySpeed;

      // Mirror the enemy when moving left
      if (normalizedDirectionX < 0 && this.facingRight) {
        this.mirrorEnemy();
      } else if (normalizedDirectionX > 0 && !this.facingRight) {
        // Restore the original orientation when moving right
        this.restoreOrientation();
      }
    }

    // Check if it's time for another attack during the attack animation
    if (this.isAttacking) {
      const currentTime = performance.now();
      if (currentTime - this.lastAttackTime >= this.attackInterval) {
        this.lastAttackTime = currentTime;

        // Call the function to perform the attack
        this.attackPlayer();
      }
    }
  }

  private mirrorEnemy(): void {
    this.animatedSprite.scale.x *= -1;
    this.facingRight = false;
  }

  private restoreOrientation(): void {
    this.animatedSprite.scale.x *= -1;
    this.facingRight = true;
  }

  private attackPlayer(): void {
    // Play the attacking animation
    this.playAttackAnimation();

    // Play the attack sound for the enemy
    this.playAttackSound();

    const attackRange = 150;

    // Call the function to handle the attack on the player
    this.player.takeDamage(this.stats.damage, attackRange);
  }

  private playAttackSound(): void {
    // Assuming you have an attack sound for the enemy
    const enemyAttackSound = document.getElementById(
      "enemyAttackSound"
    ) as HTMLAudioElement;

    // Check if the audio is paused or not
    if (enemyAttackSound.paused) {
      // Reset the currentTime to start the sound from the beginning
      enemyAttackSound.currentTime = 0;
      // Play the sound
      enemyAttackSound.play();
    }
  }

  private playAttackAnimation(): void {
    // Stop the current animation and play the attacking animation
    this.animatedSprite.stop();
    this.animatedSprite.textures = this.attackingFrames;
    this.animatedSprite.loop = true;
    this.animatedSprite.animationSpeed = 0.1;
    this.animatedSprite.play();
  }

  private playMovingAnimation(): void {
    // Stop the current animation and play the moving animation
    this.animatedSprite.stop();
    this.animatedSprite.textures = this.frames; // Assuming you have frames for moving animation
    this.animatedSprite.loop = true; // Set to true if you want to loop the moving animation
    this.animatedSprite.play();
  }

  public resumeMovement(): void {
    this.shouldMove = true;
  }
}

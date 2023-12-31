import * as PIXI from "pixi.js";
import { Keys } from "../interfaces/keys";
import { PlayerStats } from "../interfaces/playerStats";
import { Enemy } from "./enemy";
import { Game } from "../game";

// Player class
export class Player {
  private standingFrames: PIXI.Texture[];
  private movingFrames: PIXI.Texture[];
  private attackingFrames: PIXI.Texture[];
  private blockingFrames: PIXI.Texture[];
  private deathFrames: PIXI.Texture[];
  public animatedSprite: PIXI.AnimatedSprite;
  private keys: Keys;
  private playerSpeed: number;
  private playerWidth: number = 150;
  private playerHeight: number = 150;
  private app: PIXI.Application;
  private facingRight: boolean = true;
  private moveSound: HTMLAudioElement;
  private attackSound: HTMLAudioElement;
  private isAttacking: boolean = false;
  private lastAttackTime: number = 0;
  private isBlocking: boolean = false;
  private isActing: boolean = false;
  public stats: PlayerStats;
  private game: Game;
  private defeatedEnemies: number = 0;

  constructor(app: PIXI.Application, game: Game) {
    this.app = app;
    this.game = game;

    this.stats = {
      health: 100,
      maxHealth: 100,
      damage: 20,
      armor: 30,
    };

    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      v: false,
      c: false,
    };
    this.playerSpeed = 5;
    this.moveSound = document.getElementById("moveSound") as HTMLAudioElement;
    this.attackSound = document.getElementById(
      "attackSound"
    ) as HTMLAudioElement;

    // Load frames for standing animation
    this.standingFrames = [
      PIXI.Texture.from("images/knight/standing/knight_standing1.png"),
      PIXI.Texture.from("images/knight/standing/knight_standing2.png"),
      PIXI.Texture.from("images/knight/standing/knight_standing3.png"),
      PIXI.Texture.from("images/knight/standing/knight_standing4.png"),
    ];

    // Load frames for moving animation
    this.movingFrames = [
      PIXI.Texture.from("images/knight/moving/knight_moving1.png"),
      PIXI.Texture.from("images/knight/moving/knight_moving2.png"),
      PIXI.Texture.from("images/knight/moving/knight_moving3.png"),
      PIXI.Texture.from("images/knight/moving/knight_moving4.png"),
      PIXI.Texture.from("images/knight/moving/knight_moving5.png"),
      PIXI.Texture.from("images/knight/moving/knight_moving6.png"),
      PIXI.Texture.from("images/knight/moving/knight_moving7.png"),
      PIXI.Texture.from("images/knight/moving/knight_moving8.png"),
    ];

    // Load frames for attacking
    this.attackingFrames = [
      PIXI.Texture.from("images/knight/attack/attack1.png"),
      PIXI.Texture.from("images/knight/attack/attack2.png"),
      PIXI.Texture.from("images/knight/attack/attack3.png"),
      PIXI.Texture.from("images/knight/attack/attack4.png"),
      PIXI.Texture.from("images/knight/attack/attack5.png"),
      PIXI.Texture.from("images/knight/attack/attack6.png"),
      PIXI.Texture.from("images/knight/attack/attack7.png"),
      PIXI.Texture.from("images/knight/attack/attack8.png"),
      PIXI.Texture.from("images/knight/attack/attack9.png"),
      PIXI.Texture.from("images/knight/attack/attack10.png"),
    ];

    // Load frames for blocking animation
    this.blockingFrames = [
      PIXI.Texture.from("images/knight/blocking/blocking1.png"),
      PIXI.Texture.from("images/knight/blocking/blocking2.png"),
      PIXI.Texture.from("images/knight/blocking/blocking3.png"),
      PIXI.Texture.from("images/knight/blocking/blocking4.png"),
      PIXI.Texture.from("images/knight/blocking/blocking5.png"),
      PIXI.Texture.from("images/knight/blocking/blocking6.png"),
      PIXI.Texture.from("images/knight/blocking/blocking7.png"),
    ];

    // Load frames for death animation
    this.deathFrames = [
      PIXI.Texture.from("images/knight/dying/dying1.png"),
      PIXI.Texture.from("images/knight/dying/dying2.png"),
      PIXI.Texture.from("images/knight/dying/dying3.png"),
      PIXI.Texture.from("images/knight/dying/dying4.png"),
      PIXI.Texture.from("images/knight/dying/dying5.png"),
      PIXI.Texture.from("images/knight/dying/dying6.png"),
      PIXI.Texture.from("images/knight/dying/dying7.png"),
      PIXI.Texture.from("images/knight/dying/dying8.png"),
      PIXI.Texture.from("images/knight/dying/dying9.png"),
    ];

    this.animatedSprite = new PIXI.AnimatedSprite(this.standingFrames);
    this.animatedSprite.width = this.playerWidth;
    this.animatedSprite.height = this.playerHeight;
    this.animatedSprite.anchor.set(0.5);
    this.animatedSprite.x = 60;
    this.animatedSprite.y = 530;
    this.animatedSprite.animationSpeed = 0.2;
    this.animatedSprite.play();

    app.stage.addChild(this.animatedSprite);
  }

  private showWinScreen(): void {
    const winScreen = document.getElementById("winScreen");
    if (winScreen) {
      winScreen.classList.add("screen");
      winScreen.classList.remove("hidden");
    }
  }

  public defeatEnemy(): void {
    this.defeatedEnemies++;
    // Check if the player has defeated all enemies (adjust the condition accordingly)
    if (this.defeatedEnemies === this.game.enemies.length) {
      setTimeout(() => {
        this.showWinScreen();
      }, 2000);
    }
  }

  public getStats(): PlayerStats {
    return { ...this.stats }; // Return a copy to prevent direct modification
  }

  public takeDamage(amount: number, attackRange: number): void {
    // Check if the player is within the attack range
    const playerBounds = this.animatedSprite.getBounds();
    // Check if the player is blocking
    if (this.isBlocking) {
      // Reduce damage when blocking
      amount = 0;
    }

    if (
      attackRange >= playerBounds.width &&
      attackRange >= playerBounds.height
    ) {
      // Apply damage to the player, considering armor
      const damageTaken = Math.max(amount - this.stats.armor, 0);
      this.stats.health -= damageTaken;

      if (this.stats.health <= 0) {
        this.playDeathAnimation();
        this.stats.health = 0;

        // Show the death screen after 5 seconds
        setTimeout(() => {
          this.showDeathScreen();
        }, 2000);
      }
    }
  }

  private showDeathScreen(): void {
    const deathScreen = document.getElementById("deathScreen");
    if (deathScreen) {
      deathScreen.classList.add("screen");
      deathScreen.classList.remove("hidden");
    }
  }

  public handleKeyDown(event: KeyboardEvent): void {
    if (event.key in this.keys && !this.isActing) {
      this.keys[event.key] = true;
    }
  }

  public handleKeyUp(event: KeyboardEvent): void {
    if (event.key in this.keys) {
      this.keys[event.key] = false;
    }
  }

  public update(): void {
    if (this.stats.health <= 0) {
      return; // Skip the rest of the update logic
    }
    if (this.keys.w) {
      if (this.animatedSprite.y < this.app.screen.height - 530) {
        return;
      }
      this.animatedSprite.y -= this.playerSpeed;
      this.playMoveSound();
    }
    if (this.keys.a) {
      if (this.facingRight) {
        this.animatedSprite.scale.x *= -1;
        this.facingRight = false;
      }
      if (this.animatedSprite.x < 50) {
        return;
      }
      this.animatedSprite.x -= this.playerSpeed;
      this.playMoveSound();
    }
    if (this.keys.s) {
      if (this.animatedSprite.y > this.app.screen.height - 80) {
        return;
      }
      this.animatedSprite.y += this.playerSpeed;
      this.playMoveSound();
    }
    if (this.keys.d) {
      if (!this.facingRight) {
        this.animatedSprite.scale.x *= -1;
        this.facingRight = true;
      }
      if (this.animatedSprite.x > this.app.screen.width - 55) {
        return;
      }
      this.animatedSprite.x += this.playerSpeed;
      this.playMoveSound();
    }

    // Update animation based on movement
    if (this.keys.w || this.keys.a || this.keys.s || this.keys.d) {
      // Switch to moving animation
      if (this.animatedSprite.textures !== this.movingFrames) {
        this.animatedSprite.stop();
        this.animatedSprite.textures = this.movingFrames;
        this.animatedSprite.play();
      }
    } else if (this.keys.v) {
      this.isActing = true;
      if (!this.isAttacking) {
        this.isAttacking = true;
        this.lastAttackTime = performance.now(); // Record the time of the first attack

        // Increase player size by 20%
        const originalWidth = this.animatedSprite.width;
        const originalHeight = this.animatedSprite.height;
        this.animatedSprite.width = originalWidth * 1.4;
        this.animatedSprite.height = originalHeight * 1.4;

        if (this.animatedSprite.textures !== this.attackingFrames) {
          this.animatedSprite.stop();
          this.animatedSprite.textures = this.attackingFrames;
          this.animatedSprite.play();
          this.playAttackSound();
        }
      }

      const currentTime = performance.now();

      // Check if 2 seconds have passed since the last attack sound
      if (currentTime - this.lastAttackTime >= 950) {
        this.lastAttackTime = currentTime;
        this.playAttackSound();
        this.attack();
      }
    } else if (this.keys.c) {
      this.isActing = true;
      if (!this.isBlocking) {
        this.isBlocking = true;
      }
      if (this.animatedSprite.textures !== this.blockingFrames) {
        this.animatedSprite.stop();
        this.animatedSprite.textures = this.blockingFrames;
        this.animatedSprite.play();
        this.animatedSprite.gotoAndStop(this.blockingFrames.length - 1);
      }
    } else {
      this.isActing = false;
      if (this.isAttacking) {
        this.isAttacking = false;
      }
      if (this.isBlocking) {
        this.isBlocking = false;
      }
      // Reset player size to original
      this.animatedSprite.width = this.playerWidth;
      this.animatedSprite.height = this.playerHeight;

      // If not moving, play standing animation
      if (this.animatedSprite.textures !== this.standingFrames) {
        this.animatedSprite.stop();
        this.animatedSprite.textures = this.standingFrames;
        this.animatedSprite.play();
      }
    }
  }

  public attack(): void {
    // Check if the enemy is alive
    const aliveEnemies = this.game.enemies.filter(
      (enemy) => enemy.stats.health > 0
    );

    if (aliveEnemies.length === 0) {
      // No alive enemies, exit the attack function
      return;
    }

    const attackRange = 150; // Adjust the attack range as needed

    // Calculate the attack direction based on the player's facing direction
    const attackDirection = this.facingRight ? 1 : -1;

    // Define the attack hitbox
    const attackHitbox = new PIXI.Rectangle(
      this.animatedSprite.x + (attackDirection > 0 ? 0 : -attackRange),
      this.animatedSprite.y - attackRange / 2,
      attackRange,
      attackRange
    );

    // Loop through all enemies and check if they are in the attack hitbox
    for (const enemy of this.game.enemies) {
      if (enemy instanceof Enemy) {
        const enemyBounds = enemy.animatedSprite.getBounds();
        if (attackHitbox.intersects(enemyBounds)) {
          // Enemy is within the attack hitbox, apply damage
          enemy.takeDamage(this.stats.damage);
        }

        if (enemy.isAttackingWilePlayerIsAttacking) {
          this.takeDamage(enemy.stats.damage, 2000);
        }
      }
    }
  }

  private playDeathAnimation(): void {
    // Stop any ongoing animations
    this.animatedSprite.stop();

    // Set death animation frames
    this.animatedSprite.textures = this.deathFrames;

    // Set animation speed and play the death animation
    this.animatedSprite.animationSpeed = 0.2;
    this.animatedSprite.loop = false;
    this.animatedSprite.play();

    // Disable player input
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      v: false,
      c: false,
    };
  }

  private playMoveSound(): void {
    // Check if the audio is paused or not
    if (this.moveSound.paused) {
      // Reset the currentTime to start the sound from the beginning
      this.moveSound.currentTime = 0;
      // Play the sound
      this.moveSound.play();
    }
  }

  private playAttackSound(): void {
    // Check if the audio is paused or not
    if (this.attackSound.paused) {
      // Reset the currentTime to start the sound from the beginning
      this.attackSound.currentTime = 0;
      // Play the sound
      this.attackSound.play();
    }
  }

  public reset(): void {
    // Reset player stats to initial values
    this.stats = {
      health: 100,
      maxHealth: 100,
      damage: 20,
      armor: 30,
    };

    // Reset player position
    this.animatedSprite.x = 60;
    this.animatedSprite.y = 530;

    // Reset any other player-specific state
    this.isAttacking = false;
    this.isBlocking = false;
    this.isActing = false;

    // Play the standing animation
    this.animatedSprite.stop();
    this.animatedSprite.textures = this.standingFrames;
    this.animatedSprite.play();
  }
}

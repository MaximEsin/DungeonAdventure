import * as PIXI from "pixi.js";
import { Keys } from "../interfaces/keys";

// Player class
export class Player {
  private animatedSprite: PIXI.AnimatedSprite;
  private keys: Keys;
  private playerSpeed: number;
  private playerWidth: number = 150;
  private playerHeight: number = 150;
  private app: PIXI.Application;
  private facingRight: boolean = true;
  private moveSound: HTMLAudioElement;

  constructor(app: PIXI.Application) {
    this.app = app;
    const frames = [];
    for (let i = 1; i < 5; i++) {
      frames.push(
        PIXI.Texture.from(`images/knight/standing/knight_standing${i}.png`)
      );
    }
    this.animatedSprite = new PIXI.AnimatedSprite(frames);
    this.animatedSprite.width = this.playerWidth;
    this.animatedSprite.height = this.playerHeight;
    this.animatedSprite.anchor.set(0.5);
    this.animatedSprite.x = 60;
    this.animatedSprite.y = 530;
    this.animatedSprite.animationSpeed = 0.2;
    this.animatedSprite.play();

    app.stage.addChild(this.animatedSprite);

    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
    };
    console.log(frames);
    this.playerSpeed = 5;
    this.moveSound = document.getElementById("moveSound") as HTMLAudioElement;
  }

  public handleKeyDown(event: KeyboardEvent): void {
    if (event.key in this.keys) {
      this.keys[event.key] = true;
    }
  }

  public handleKeyUp(event: KeyboardEvent): void {
    if (event.key in this.keys) {
      this.keys[event.key] = false;
    }
  }

  public update(): void {
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
}

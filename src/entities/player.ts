import * as PIXI from "pixi.js";
import { Keys } from "../interfaces/keys";

// Player class
export class Player {
  private sprite: PIXI.Sprite;
  private keys: Keys;
  private playerSpeed: number;
  private playerWidth: number = 100;
  private playerHeight: number = 100;
  private app: PIXI.Application;
  private facingRight: boolean = true;
  private moveSound: HTMLAudioElement;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.sprite = new PIXI.Sprite(PIXI.Texture.from("images/knight.png"));
    this.sprite.width = this.playerWidth;
    this.sprite.height = this.playerHeight;
    this.sprite.anchor.set(0.5);
    this.sprite.x = 60;
    this.sprite.y = 550;
    app.stage.addChild(this.sprite);

    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
    };

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
      if (this.sprite.y < this.app.screen.height - 550) {
        return;
      }
      this.sprite.y -= this.playerSpeed;
      this.playMoveSound();
    }
    if (this.keys.a) {
      if (this.facingRight) {
        this.sprite.scale.x *= -1;
        this.facingRight = false;
      }
      if (this.sprite.x < 50) {
        return;
      }
      this.sprite.x -= this.playerSpeed;
      this.playMoveSound();
    }
    if (this.keys.s) {
      if (this.sprite.y > this.app.screen.height - 50) {
        return;
      }
      this.sprite.y += this.playerSpeed;
      this.playMoveSound();
    }
    if (this.keys.d) {
      if (!this.facingRight) {
        this.sprite.scale.x *= -1;
        this.facingRight = true;
      }
      if (this.sprite.x > this.app.screen.width - 55) {
        return;
      }
      this.sprite.x += this.playerSpeed;
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

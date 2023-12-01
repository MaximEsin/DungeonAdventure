import { PlayerStats } from "../interfaces/playerStats";

export class InterfaceManager {
  private healthElement: HTMLParagraphElement;
  private damageElement: HTMLParagraphElement;
  private armorElement: HTMLParagraphElement;

  constructor() {
    // Get the interface elements
    this.healthElement = document.getElementById(
      "health"
    ) as HTMLParagraphElement;
    this.damageElement = document.getElementById(
      "damage"
    ) as HTMLParagraphElement;
    this.armorElement = document.getElementById(
      "armor"
    ) as HTMLParagraphElement;
  }

  public updateInterface(playerStats: PlayerStats): void {
    this.healthElement.textContent = `Health: ${playerStats.health}`;
    this.damageElement.textContent = `Damage: ${playerStats.damage}`;
    this.armorElement.textContent = `Armor: ${playerStats.armor}`;
  }
}

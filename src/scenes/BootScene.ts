import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create() {
    const width = 960;
    const height = 540;
    const texture = this.textures.createCanvas("starfield", width, height);
    if (!texture) {
      this.scene.start("game");
      return;
    }
    const context = texture.getContext();
    context.fillStyle = "#101820";
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < 120; i += 1) {
      const brightness = Phaser.Math.Between(80, 220);
      context.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
      context.fillRect(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        1,
        1
      );
    }
    texture.refresh();

    const playerTexture = this.textures.createCanvas("player", 32, 32);
    if (playerTexture) {
      const ctx = playerTexture.getContext();
      ctx.fillStyle = "#4fd1c5";
      ctx.beginPath();
      ctx.moveTo(16, 3);
      ctx.lineTo(28, 29);
      ctx.lineTo(16, 23);
      ctx.lineTo(4, 29);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.stroke();
      playerTexture.refresh();
    }

    const gemTexture = this.textures.createCanvas("gem", 24, 24);
    if (gemTexture) {
      const ctx = gemTexture.getContext();
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.moveTo(12, 2);
      ctx.lineTo(22, 12);
      ctx.lineTo(12, 22);
      ctx.lineTo(2, 12);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fff3c4";
      ctx.beginPath();
      ctx.arc(9, 9, 3, 0, Math.PI * 2);
      ctx.fill();
      gemTexture.refresh();
    }

    const enemyTexture = this.textures.createCanvas("enemy", 40, 40);
    if (enemyTexture) {
      const ctx = enemyTexture.getContext();
      ctx.fillStyle = "#ef476f";
      ctx.beginPath();
      ctx.arc(20, 20, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffd6e0";
      ctx.beginPath();
      ctx.arc(15, 15, 5, 0, Math.PI * 2);
      ctx.fill();
      enemyTexture.refresh();
    }

    const particleTexture = this.textures.createCanvas("particle", 8, 8);
    if (particleTexture) {
      const ctx = particleTexture.getContext();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(4, 4, 3, 0, Math.PI * 2);
      ctx.fill();
      particleTexture.refresh();
    }

    this.scene.start("game");
  }
}

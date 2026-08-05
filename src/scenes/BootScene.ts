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

    this.scene.start("game");
  }
}

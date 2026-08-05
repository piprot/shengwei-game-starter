import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";
import { Sfx } from "../audio";

export class GameScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Rectangle;
  private enemy?: Phaser.GameObjects.Arc;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>;
  private gems?: Phaser.Physics.Arcade.Group;
  private scoreText?: Phaser.GameObjects.Text;
  private score = 0;
  private highScore = Number(localStorage.getItem("neon-chase-high-score") || 0);
  private gameOver = false;
  private started = false;
  private pointerTarget?: Phaser.Math.Vector2;
  private startText?: Phaser.GameObjects.Text;
  private sfx = new Sfx();

  constructor() {
    super("game");
  }

  create() {
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    this.add.text(centerX, 56, "Neon Chase", {
      fontFamily: "Arial",
      fontSize: "28px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.add.text(centerX, 86, "Collect gems. Avoid the chaser.", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#9fb3c8"
    }).setOrigin(0.5);

    this.startText = this.add.text(
      centerX,
      300,
      `Tap or Click to Start\nHigh Score: ${this.highScore}`,
      {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#ffd166",
        align: "center"
      }
    ).setOrigin(0.5);

    this.player = this.add.rectangle(centerX, centerY, 32, 32, 0x4fd1c5);
    this.physics.add.existing(this.player);
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setCollideWorldBounds(true);

    this.enemy = this.add.circle(70, 70, 18, 0xef476f);
    this.physics.add.existing(this.enemy);
    const enemyBody = this.enemy.body as Phaser.Physics.Arcade.Body;
    enemyBody.setCollideWorldBounds(true);

    this.physics.add.overlap(
      this.player,
      this.enemy,
      this.hitEnemy,
      undefined,
      this
    );

    this.gems = this.physics.add.group();
    for (let i = 0; i < 6; i += 1) {
      const gem = this.add.circle(
        70 + i * 150,
        140 + (i % 3) * 120,
        12,
        0xffd166
      );
      this.physics.add.existing(gem);
      this.gems.add(gem);
    }

    this.physics.add.overlap(
      this.player,
      this.gems,
      this.collectGem,
      undefined,
      this
    );

    this.scoreText = this.add.text(24, 24, "Score: 0", {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#ffffff"
    });

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys("W,A,S,D") as Record<
        string,
        Phaser.Input.Keyboard.Key
      >;
    }

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.pointerTarget = new Phaser.Math.Vector2(pointer.x, pointer.y);
      }
    });
    this.input.on("pointerdown", () => {
      this.sfx.ensure();
      this.startGame();
    });
    this.input.keyboard?.once("keydown-SPACE", () => this.startGame());
    this.input.keyboard?.once("keydown-ENTER", () => this.startGame());
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (!this.started) {
      const playerBody = this.player?.body as Phaser.Physics.Arcade.Body | undefined;
      const enemyBody = this.enemy?.body as Phaser.Physics.Arcade.Body | undefined;
      playerBody?.setVelocity(0, 0);
      enemyBody?.setVelocity(0, 0);
      return;
    }

    const speed = 4;
    let dx = 0;
    let dy = 0;

    if (this.cursors?.left.isDown || this.wasd?.A.isDown) dx -= 1;
    if (this.cursors?.right.isDown || this.wasd?.D.isDown) dx += 1;
    if (this.cursors?.up.isDown || this.wasd?.W.isDown) dy -= 1;
    if (this.cursors?.down.isDown || this.wasd?.S.isDown) dy += 1;

    if (this.player && dx === 0 && dy === 0 && this.pointerTarget) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.pointerTarget.x,
        this.pointerTarget.y
      );
      if (distance > 4) {
        const angle = Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          this.pointerTarget.x,
          this.pointerTarget.y
        );
        this.player.x += Math.cos(angle) * speed;
        this.player.y += Math.sin(angle) * speed;
      }
    } else if (this.player) {
      this.player.x = Phaser.Math.Clamp(this.player.x + dx * speed, 16, GAME_WIDTH - 16);
      this.player.y = Phaser.Math.Clamp(this.player.y + dy * speed, 16, GAME_HEIGHT - 16);
    }

    if (this.player && this.enemy) {
      const angle = Phaser.Math.Angle.Between(
        this.enemy.x,
        this.enemy.y,
        this.player.x,
        this.player.y
      );
      const enemyBody = this.enemy.body as Phaser.Physics.Arcade.Body;
      const enemySpeed = Math.min(320, 150 + this.score * 12);
      enemyBody.setVelocity(Math.cos(angle) * enemySpeed, Math.sin(angle) * enemySpeed);
    }
  }

  private startGame() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.sfx.ensure();
    this.startText?.setVisible(false);
  }

  private collectGem(
    _player:
      | Phaser.GameObjects.GameObject
      | Phaser.Physics.Arcade.Body
      | Phaser.Physics.Arcade.StaticBody
      | Phaser.Tilemaps.Tile,
    gem:
      | Phaser.GameObjects.GameObject
      | Phaser.Physics.Arcade.Body
      | Phaser.Physics.Arcade.StaticBody
      | Phaser.Tilemaps.Tile
  ) {
    const gemObject = gem as Phaser.GameObjects.Arc;
    gemObject.destroy();
    this.score += 1;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("neon-chase-high-score", String(this.highScore));
    }
    this.scoreText?.setText(`Score: ${this.score}`);
    this.sfx.collect();

    const burst = this.add.circle(gemObject.x, gemObject.y, 8, 0xffd166);
    this.tweens.add({
      targets: burst,
      scale: 3,
      alpha: 0,
      duration: 220,
      onComplete: () => burst.destroy()
    });
    this.tweens.add({
      targets: this.scoreText,
      scale: 1.2,
      duration: 80,
      yoyo: true
    });

    const remaining = this.gems?.countActive(true) ?? 0;
    if (remaining === 0) {
      this.time.delayedCall(250, () => this.scene.restart());
    }
  }

  private hitEnemy(
    _player:
      | Phaser.GameObjects.GameObject
      | Phaser.Physics.Arcade.Body
      | Phaser.Physics.Arcade.StaticBody
      | Phaser.Tilemaps.Tile,
    _enemy:
      | Phaser.GameObjects.GameObject
      | Phaser.Physics.Arcade.Body
      | Phaser.Physics.Arcade.StaticBody
      | Phaser.Tilemaps.Tile
  ) {
    if (this.gameOver) {
      return;
    }
    this.gameOver = true;
    this.sfx.gameOver();
    this.cameras.main.shake(150, 0.005);

    const playerBody = this.player?.body as Phaser.Physics.Arcade.Body | undefined;
    const enemyBody = this.enemy?.body as Phaser.Physics.Arcade.Body | undefined;
    playerBody?.setVelocity(0, 0);
    enemyBody?.setVelocity(0, 0);
    this.player?.setFillStyle(0xffffff);
    this.time.delayedCall(150, () => this.player?.setFillStyle(0x4fd1c5));

    this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      `Game Over\nHigh Score: ${this.highScore}`,
      {
        fontFamily: "Arial",
        fontSize: "36px",
        color: "#ef476f",
        align: "center"
      }
    ).setOrigin(0.5);

    this.time.delayedCall(1200, () => this.scene.restart());
  }
}

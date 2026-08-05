import Phaser from "phaser";
import { Sfx } from "../audio";

export class GameScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Triangle;
  private enemies?: Phaser.Physics.Arcade.Group;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>;
  private gems?: Phaser.Physics.Arcade.Group;
  private scoreText?: Phaser.GameObjects.Text;
  private waveText?: Phaser.GameObjects.Text;
  private comboText?: Phaser.GameObjects.Text;
  private score = 0;
  private wave = 1;
  private combo = 1;
  private lastCollectTime = 0;
  private highScore = Number(localStorage.getItem("neon-chase-high-score") || 0);
  private gameOver = false;
  private started = false;
  private pointerTarget?: Phaser.Math.Vector2;
  private startText?: Phaser.GameObjects.Text;
  private muteText?: Phaser.GameObjects.Text;
  private pauseText?: Phaser.GameObjects.Text;
  private helpText?: Phaser.GameObjects.Text;
  private sfx = new Sfx();
  private muted = false;
  private paused = false;

  constructor() {
    super("game");
  }

  create() {
    const sceneWidth = this.scale.width;
    const sceneHeight = this.scale.height;
    const centerX = sceneWidth / 2;
    const centerY = sceneHeight / 2;

    this.add
      .image(sceneWidth / 2, sceneHeight / 2, "starfield")
      .setDisplaySize(sceneWidth, sceneHeight)
      .setDepth(-2);

    const grid = this.add.graphics();
    grid.lineStyle(1, 0x264653, 0.35);
    const step = 40;
    for (let x = 0; x <= sceneWidth; x += step) {
      grid.lineBetween(x, 0, x, sceneHeight);
    }
    for (let y = 0; y <= sceneHeight; y += step) {
      grid.lineBetween(0, y, sceneWidth, y);
    }
    grid.setDepth(-1);

    this.add.text(centerX, 56, "Neon Chase", {
      fontFamily: "Arial",
      fontSize: "28px",
      color: "#ffffff"
    }).setOrigin(0.5).setStroke("#000000", 4);

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

    this.player = this.add.triangle(
      centerX,
      centerY,
      0,
      -16,
      -12,
      12,
      12,
      12,
      0x4fd1c5
    );
    this.physics.add.existing(this.player);
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setCollideWorldBounds(true);

    this.enemies = this.physics.add.group();
    this.spawnEnemy(70, 70);

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hitEnemy,
      undefined,
      this
    );

    this.gems = this.physics.add.group();
    this.spawnGems(6);

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
    }).setStroke("#000000", 4);

    this.waveText = this.add.text(sceneWidth - 24, 24, "Wave 1", {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#ffffff"
    }).setOrigin(1, 0).setStroke("#000000", 4);

    this.comboText = this.add.text(sceneWidth / 2, 24, "", {
      fontFamily: "Arial",
      fontSize: "22px",
      color: "#ffd166"
    }).setOrigin(0.5, 0).setStroke("#000000", 4);

    this.muteText = this.add.text(sceneWidth - 24, 56, "M: Mute", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#9fb3c8"
    }).setOrigin(1, 0).setStroke("#000000", 4);

    this.add.text(sceneWidth - 24, 80, "P: Pause", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#9fb3c8"
    }).setOrigin(1, 0).setStroke("#000000", 4);

    this.add.text(24, 80, "H: Help  R: Restart", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#9fb3c8"
    }).setStroke("#000000", 4);

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
    this.input.keyboard?.on("keydown-M", () => this.toggleMute());
    this.input.keyboard?.on("keydown-P", () => this.togglePause());
    this.input.keyboard?.on("keydown-R", () => this.scene.restart());
    this.input.keyboard?.on("keydown-H", () => this.toggleHelp());

    this.time.addEvent({
      delay: 60,
      loop: true,
      callback: () => {
        if (
          this.started &&
          !this.gameOver &&
          !this.paused &&
          this.player
        ) {
          const trail = this.add.circle(
            this.player.x,
            this.player.y,
            4,
            0x4fd1c5
          );
          this.tweens.add({
            targets: trail,
            alpha: 0,
            scale: 0.4,
            duration: 300,
            onComplete: () => trail.destroy()
          });
        }
      }
    });
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (this.paused) {
      const playerBody = this.player?.body as Phaser.Physics.Arcade.Body | undefined;
      playerBody?.setVelocity(0, 0);
      this.enemies?.getChildren().forEach((enemy) => {
        const body = (enemy as Phaser.GameObjects.Arc)
          .body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);
      });
      return;
    }

    if (!this.started) {
      const playerBody = this.player?.body as Phaser.Physics.Arcade.Body | undefined;
      playerBody?.setVelocity(0, 0);
      this.enemies?.getChildren().forEach((enemy) => {
        const body = (enemy as Phaser.GameObjects.Arc)
          .body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);
      });
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
      this.player.x = Phaser.Math.Clamp(this.player.x + dx * speed, 16, this.scale.width - 16);
      this.player.y = Phaser.Math.Clamp(this.player.y + dy * speed, 16, this.scale.height - 16);
    }

    if (this.player && this.enemies) {
      const enemySpeed = Math.min(320, 150 + this.score * 12);
      this.enemies.getChildren().forEach((enemyObject) => {
        const enemy = enemyObject as Phaser.GameObjects.Arc;
        const angle = Phaser.Math.Angle.Between(
          enemy.x,
          enemy.y,
          this.player!.x,
          this.player!.y
        );
        const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
        enemyBody.setVelocity(
          Math.cos(angle) * enemySpeed,
          Math.sin(angle) * enemySpeed
        );
      });
    }
  }

  private startGame() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.sfx.ensure();
    this.sfx.startAmbient();
    this.startText?.setVisible(false);
  }

  private toggleMute() {
    this.muted = !this.muted;
    this.sfx.setMuted(this.muted);
    this.muteText?.setText(this.muted ? "M: Unmute" : "M: Mute");
  }

  private togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      this.pauseText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Paused",
        {
          fontFamily: "Arial",
          fontSize: "42px",
          color: "#ffffff",
          align: "center"
        }
      ).setOrigin(0.5).setStroke("#000000", 4);
    } else {
      this.pauseText?.destroy();
      this.pauseText = undefined;
    }
  }

  private toggleHelp() {
    if (this.helpText) {
      this.helpText.destroy();
      this.helpText = undefined;
      return;
    }
    this.helpText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Move: Arrows / WASD\nTouch: Hold and drag\nP: Pause  M: Mute  R: Restart\nH: Close Help",
      {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#ffffff",
        align: "center",
        backgroundColor: "#101820cc",
        padding: { x: 24, y: 18 }
      }
    ).setOrigin(0.5).setDepth(10);
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
    const gemObject = gem as Phaser.GameObjects.Polygon;
    gemObject.destroy();
    const now = this.time.now;
    this.combo = now - this.lastCollectTime < 2500 ? this.combo + 1 : 1;
    this.lastCollectTime = now;
    this.score += this.combo;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("neon-chase-high-score", String(this.highScore));
    }
    this.scoreText?.setText(`Score: ${this.score}`);
    this.comboText?.setText(this.combo > 1 ? `Combo x${this.combo}` : "");
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
      this.wave += 1;
      this.waveText?.setText(`Wave ${this.wave}`);
      this.spawnGems(6 + this.wave * 2);
      this.spawnEnemy(
        Phaser.Math.Between(70, this.scale.width - 70),
        Phaser.Math.Between(70, this.scale.height - 70)
      );
    }
  }

  private spawnGems(count: number) {
    const sceneWidth = this.scale.width;
    const sceneHeight = this.scale.height;
    const gemCols = sceneWidth < 700 ? 3 : 6;
    const gemRows = Math.ceil(count / gemCols);
    const gemStartY = Math.min(140, sceneHeight * 0.22);
    const gemSpacingX =
      gemCols > 1 ? (sceneWidth - 120) / (gemCols - 1) : 0;
    const gemSpacingY =
      gemRows > 1 ? (sceneHeight - gemStartY * 2) / (gemRows - 1) : 0;

    for (let i = 0; i < count; i += 1) {
      const col = i % gemCols;
      const row = Math.floor(i / gemCols);
      const gem = this.add.polygon(
        60 + col * gemSpacingX,
        gemStartY + row * gemSpacingY,
        [0, -10, 9, 0, 0, 10, -9, 0],
        0xffd166
      );
      this.physics.add.existing(gem);
      this.gems?.add(gem);
    }
  }

  private spawnEnemy(x: number, y: number) {
    const enemy = this.add.circle(x, y, 18, 0xef476f);
    this.physics.add.existing(enemy);
    const body = enemy.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    this.tweens.add({
      targets: enemy,
      scale: 1.2,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    this.enemies?.add(enemy);
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
    this.sfx.stopAmbient();
    this.cameras.main.shake(150, 0.005);

    const playerBody = this.player?.body as Phaser.Physics.Arcade.Body | undefined;
    playerBody?.setVelocity(0, 0);
    this.enemies?.getChildren().forEach((enemy) => {
      const body = (enemy as Phaser.GameObjects.Arc)
        .body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
    });
    this.player?.setFillStyle(0xffffff);
    this.time.delayedCall(150, () => this.player?.setFillStyle(0x4fd1c5));

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      `Game Over\nWave ${this.wave} - High Score: ${this.highScore}`,
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

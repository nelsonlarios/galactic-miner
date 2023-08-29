import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0x00ff00, 1);
    this.healthBar.fillRect(10, 10, this.playerHealth, 10);
  }

  updateScore(value) {
    this.score += value;
    this.scoreText.setText("Score: " + this.score);
  }

  preload() {
    // Load assets here
    this.load.image("ship", "assets/ship.png");
    this.load.image("asteroid", "assets/asteroid.png");
    this.load.image("bullet", "assets/bullet.png");

    this.load.spritesheet("explosion", "assets/exp2_0.jpg", {
      frameWidth: 64, // replace with your frame width
      frameHeight: 64, // replace with your frame height
    });
  }

  gameOver() {
    this.add.text(400, 300, `Final Score: ${this.score}`, { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
    this.physics.pause(); // Pause the game
  }

  create() {
    this.remainingTime = 60;
    this.timeText = this.add.text(10, 30, "Time: 60", { fontSize: "16px", fill: "#fff" });

    // ship
    this.ship = this.physics.add.sprite(400, 300, "ship").setScale(0.15);

    // bullets
    this.bullets = this.physics.add.group();

    this.asteroids = this.physics.add.group();

    // explosion animation
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 15 }),
      frameRate: 20,
      hideOnComplete: true,
    });

    // health bar HP
    this.playerHealth = 700; // Initialize player health to 100
    this.healthBar = this.add.graphics();
    this.healthBar.fillStyle(0x00ff00, 1); // Green color
    this.healthBar.fillRect(10, 10, this.playerHealth, 10); // Draw initial health bar

    this.score = 0;
    this.scoreText = this.add.text(712, 10, "Score: 0", { fontSize: "16px", fill: "#fff" });

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.remainingTime--;
        this.timeText.setText("Time: " + this.remainingTime);

        if (this.remainingTime <= 0) {
          this.gameOver();
        }
      },
      loop: true,
    });
  }

  update() {
    // Game loop logic here
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.ship.setVelocityX(-260);
    } else if (cursors.right.isDown) {
      this.ship.setVelocityX(260);
    } else {
      this.ship.setVelocityX(0);
    }

    if (cursors.up.isDown) {
      this.ship.setVelocityY(-260);
    } else if (cursors.down.isDown) {
      this.ship.setVelocityY(260);
    } else {
      this.ship.setVelocityY(0);
    }

    const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    if (Phaser.Input.Keyboard.JustDown(spaceBar)) {
      const bullet = this.bullets.create(this.ship.x, this.ship.y, "bullet");
      bullet.setScale(0.02);
      bullet.setVelocityX(400);
      this.updateScore(-1); // Lose 1 point for shooting
    }

    //Generate new asteroids
    if (Math.random() < 0.02) {
      const randomY = Math.floor(Math.random() * 600); // Assuming the game height is 600
      const asteroid = this.asteroids.create(800, randomY, "asteroid").setScale(0.15);

      asteroid.setVelocityX(-200);
      this.physics.add.collider(this.bullets, asteroid, (bullet, asteroid) => {
        bullet.destroy();
        asteroid.destroy();

        this.updateScore(2); // Gain 1 point
      });

      this.physics.add.collider(this.ship, asteroid, () => {
        this.playerHealth -= 10; // Reduce health by 10
        this.updateHealthBar();

        // Check if health has reached zero or below
        if (this.playerHealth <= 0) {
          // Play explosion animation at the ship's location
          if (this.ship.visible) {
            const explosion = this.add.sprite(this.ship.x, this.ship.y, "explosion");
            explosion.play("explode");
          }

          this.ship.setVisible(false);
        }
      });
    }

    this.asteroids.getChildren().forEach((asteroid) => {
      if (asteroid.x < 0) {
        asteroid.destroy(); // Destroy the asteroid
        this.updateScore(-1); // Decrease the score
      }
    });
  }
}

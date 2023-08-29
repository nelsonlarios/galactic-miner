import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  preload() {
    // Load assets here
    this.load.image("ship", "assets/ship.png");
    this.load.image("asteroid", "assets/asteroid.png");
    this.load.image("bullet", "assets/bullet.png");
  }

  create() {
    // ship
    this.ship = this.physics.add.sprite(400, 300, "ship").setScale(0.15);

    // bullets
    this.bullets = this.physics.add.group();

    // health bar
    this.playerHealth = 700; // Initialize player health to 100
    this.healthBar = this.add.graphics();
    this.healthBar.fillStyle(0x00ff00, 1); // Green color
    this.healthBar.fillRect(10, 10, this.playerHealth, 10); // Draw initial health bar
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0x00ff00, 1);
    this.healthBar.fillRect(10, 10, this.playerHealth, 10);
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
    }

    //Generate new asteroids
    if (Math.random() < 0.02) {
      const randomY = Math.floor(Math.random() * 600); // Assuming the game height is 600
      const asteroid = this.physics.add.sprite(800, randomY, "asteroid").setScale(0.15);
      asteroid.setVelocityX(-200);
      this.physics.add.collider(this.bullets, asteroid, (bullet, asteroid) => {
        bullet.destroy();
        asteroid.destroy();
      });

      this.physics.add.collider(this.ship, asteroid, () => {
        this.playerHealth -= 10; // Reduce health by 10
        this.updateHealthBar();

        // Check if health has reached zero or below
        if (this.playerHealth <= 0) {
          this.ship.setVisible(false);
        }
      });
    }
  }
}

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

    // // asteroids
    // this.asteroids = this.physics.add.group({
    //   key: "asteroid",
    //   repeat: 5,
    //   setXY: { x: 55, y: 50, stepX: 120 },
    // });
    // //Scale each asteroid in the group
    // this.asteroids.children.iterate((asteroid) => {
    //   asteroid.setScale(0.1); // Scale to 20%
    // });

    // bullets
    this.bullets = this.physics.add.group();

    // collisions
    this.physics.add.collider(this.bullets, this.asteroids, (bullet, asteroid) => {
      bullet.destroy();
      asteroid.destroy();
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
    }
  }
}

import React, { useEffect } from "react";
import Phaser from "phaser";
import GameScene from "./GameScene";

const GalacticMiner = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [GameScene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-container">{/* UI Components can go here */}</div>;
};

export default GalacticMiner;

var config = {
    type: Phaser.AUTO,
    physics: {
        default:'arcade',
        arcade: {
            debug: true,
            gravity: {y: 60}
        }
    },
    scene: [ example1, example2 ]
};

var game = new Phaser.Game(config);

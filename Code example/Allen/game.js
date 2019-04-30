var config = {
    type: Phaser.AUTO,
    width:800,
    height:600,
    physics: {
        default:'arcade',
        arcade: {
            gravity: {y : 500}
        }
    },
    scene: [ example1, example2 ]
};

var game = new Phaser.Game(config);

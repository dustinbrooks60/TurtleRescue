// create the map and load the functions in scene
var config = {
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {y: 60}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'images/ocean.png');
    this.load.image('ship', 'images/turtle.gif');
    this.load.image('garbage', 'images/garbage.gif')
}

function create ()
{
    //  Set the camera and physics bounds to be the size of 4x4 bg images
    this.cameras.main.setBounds(0, 0, 1697 * 2, 1191 * 2);
    this.physics.world.setBounds(0, 0, 1697 * 2, 1191 * 2);
    this.physics.world.gravity.y = 60;

    //  Mash 4 images together to create our background
    this.add.image(0, 0, 'bg').setOrigin(0);
    this.add.image(1697, 0, 'bg').setOrigin(0).setFlipX(true);
    this.add.image(0, 1191, 'bg').setOrigin(0).setFlipY(true);
    this.add.image(1697, 1191, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.image(400, 300, 'ship');

    player.setCollideWorldBounds(true);
    player.create(400,300).setGravity(0,-120);

    this.cameras.main.startFollow(player);

    this.cameras.main.followOffset.set(-300, 0);
}

function update ()
{
    player.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-500);
        player.setFlipX(true);
        this.cameras.main.followOffset.x = 300;
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(500);
        player.setFlipX(false);
        this.cameras.main.followOffset.x = -300;
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-500);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(500);
    }
}

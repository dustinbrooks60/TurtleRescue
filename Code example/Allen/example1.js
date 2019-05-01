class example1 extends Phaser.Scene {
    constructor() {
        super({key:"example1"});
    }

    preload(){
        this.load.image('bg', 'images/ocean.png');
        this.load.image('turtle', 'images/turtle.gif');
        this.load.image('garbage', 'images/garbage.gif')

    }

    create(){
        this.image = this.add.image(400,300,'turtle');
        this.cameras.main.setBounds(0, 0, 1697, 1191);
        this.physics.world.setBounds(0, 0, 1697, 1191);
        this.physics.world.gravity.y = 60;


        this.add.image(0, 0, 'bg').setOrigin(0);
        this.add.image(1697, 0, 'bg').setOrigin(0).setFlipX(true);

        let player = this.physics.add.image(128, 128, 'turtle');
        this.cameras.main.startFollow(player);
        this.cameras.main.followOffset.set(-300, 0);


        this.cameras.main.startFollow(player); // useful to follow character
        this.cameras.main.followOffset.set(-300, 0);

        player.setCollideWorldBounds(true);



        this.input.keyboard.on('keyup_D', function(event){
            this.image.x += 10;
        },this);

        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.input.on('pointerdown', function(event){
            this.image.x = event.x;
            this.image.y = event.y;

        }, this);

        this.input.keyboard.on('keyup_P', function(event){
            var physicsImage = this.physics.add.image(this.image.x, this.image.y, "turtle");
            physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-100, 100), -500)
        }, this);


        this.input.keyboard.on('keyup', function(e){
            if (e.key == "2"){
                this.scene.start("example2");
            }
        }, this)

    }

    update(delta){
        if (this.key_A.isDown)
            this.image.x--;
    }


}
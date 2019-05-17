function GameElement(width, height, src, x, y, type, num_frames) {
    if (type === "image" || type === "background" || type === "sprite") {
        this.image = new Image();
        this.image.src = src;
    }
    this.hitbox_width = width;
    this.hitbox_height = height;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.x = x; // x-axis position on canvas
    this.y = y; // y-axis position on canvas
    this.num_frames = num_frames; // number of frames in the sprite image
    this.sprite_frame = 0; // the particular frame number of the sprite image
    // redraws element on game canvas
    this.draw = function() {
        ctx = gameCanvas.context;
        if (type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = src;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (type === "image" || type === "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type === "background") {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            }
        }
        else if (type === "sprite") {
            this.hitbox_width = (this.width / this.num_frames)/4;
            this.hitbox_height = this.height /4;
            ctx.drawImage(this.image, (this.sprite_frame * (this.width / this.num_frames)), 0,
                this.width / this.num_frames, this.height, this.x, this.y, this.hitbox_width, this.hitbox_height);

            // set frame rate of sprite animations
            if (gameCanvas.frameNo % 6 === 0) {
                if (this.sprite_frame === this.num_frames - 1) {
                    this.sprite_frame = 0; // restarts the sprite animation
                }
                else {
                    this.sprite_frame++; // moves to the next sprite frame
                }
            }
        }
    };
    // Update the position of element
    this.updatePosition = function() {
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if (type === 'image' || type === "sprite") {
            this.gravitySpeed += this.gravity;
            if (this.gravitySpeed <-3) { // caps gravity at -3
                this.gravitySpeed = -3;
            }
            this.hitBottom();
            this.hitTop();
            accelerate(0.1);
        }
        if (type === "background") {
            if (this.x === -(this.width)) {
                this.x = 0;
            }
        }
    };
    // Prevents element from falling past ocean floor
    this.hitBottom = function() {
        let oceanFloor = gameCanvas.canvas.height - this.height + 450;
        if (this.y > oceanFloor) {
            this.y = oceanFloor;
            this.gravitySpeed = -2.8;
        }
    };
    // Prevents element from surpassing ocean surface
    this.hitTop = function() {
        let oceanSurface = 80;
        if (this.y < oceanSurface){
            this.y = oceanSurface;
            this.gravitySpeed = 0;
        }
    };
    // Sets the hit boxes of turtle, enemies, and garbage and detects if they collide
    this.collidesWith = function(otherObject) {
        let myLeft = this.x;
        let myRight = this.x + this.hitbox_width;
        let myTop = this.y;
        let myBottom = this.y + this.hitbox_height;
        let objectLeft = otherObject.x + 85;
        let objectRight = otherObject.x + (otherObject.hitbox_width) - 85;
        let objectTop = otherObject.y + 85;
        let objectBottom = otherObject.y + (otherObject.hitbox_height) - 75;
        let collision = true;
        if ((myBottom < objectTop) || (myTop > objectBottom) || (myRight < objectLeft) || (myLeft > objectRight)) {
            collision = false;
        }
        return collision; // Returns boolean status of a collision between a turtle and other object
    };
}
// Initialize variables
let ctx;
let turtle;
let oceanBackground;
let enemies;
let garbageArr;
let garbageClump;
let displayScore;
let displayMultiplier;
let score;
let multiplier;
let topHat;

// Create main elements for game
function startGame() {
    resetGame();
    turtle = new Element(9600, 600, './images/turtle-sprite2.png', 10, 120, "sprite", 12); // turtle object
    turtle.gravity = 0.08;
    oceanBackground = new Element(1800, window.innerHeight, './images/ocean_2.png', 0, 0, "background"); // game background
    displayScore = new Element("20px", "Consolas", "black", 10, 30, "text");
    displayMultiplier = new Element("20px", "Consolas", "black", 10, 60, "text");
    pullQuestion();
    gameCanvas.start(); // appends game canvas to the body
}

// Reset game elements for a new round of game play
function resetGame() {
    score = 0;
    multiplier = 1;
    enemies = [];
    garbageArr = [];
    topHat = false;
    garbageClump = false;
    document.getElementById("start").style.display = "none";
    document.getElementById("restart").style.display = "none";
    document.getElementById("trivia").style.display = "none";
}

// Creates the game canvas object
let gameCanvas = {
    canvas : document.createElement("canvas"),
    // Sets game canvas dimensions and appends it to the body
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameCanvas, 15); // clears and redraws game canvas every 15ms
    },
    // Clears the contents of the game canvas
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    // Stops updating the game canvas
    stop : function() {
        clearInterval(this.interval);
    },
    continue : function(){
        pullQuestion(); // pull new question after round of trivia
        this.interval = setInterval(updateGameCanvas, 15);

    }
};

function Element(width, height, src, x, y, type, num_frames) {
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
        }
        if (type === "background") {
            if (this.x === -(this.width)) {
                this.x = 0;
            }
        }
    };
    // Prevents element from falling past ocean floor
    this.hitBottom = function() {
        let oceanFloor = gameCanvas.canvas.height - this.height + 425;
        if (this.y > oceanFloor) {
            this.y = oceanFloor;
            this.gravitySpeed = 0;
        }
        accelerate(0.1);
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

// Accelerates turtle upon screen touch
function clickManager(n){
    accelerate(n);
}

function accelerate(n){
    turtle.gravity = n;
}

// Return true if the canvas frame number is a multiple of the argument, n
function everyInterval(n) {
    return (gameCanvas.frameNo / n) % 1 === 0;
}

// Clear nearby enemies after trivia
function clearNearbyEnemies() {
    let enemiesCopy = enemies.slice(0);
    for (let i = enemiesCopy.length - 1; i > -1; i--) {
        if (enemiesCopy[i].x < (gameCanvas.canvas.width * 0.35) && enemiesCopy[i].y > (turtle.y - 25)) {
            enemies.splice(i, 1);
        }
    }
}

// Redraws the game canvas and all elements in it
function updateGameCanvas() {
    checkCollision();
    gameCanvas.clear();
    gameCanvas.frameNo += 1;
    oceanBackground.speedX = -1;
    oceanBackground.updatePosition();
    oceanBackground.draw();
    addObjects();
    drawElements();
    displayScore.text = "Garbage Collected:" + score;
    displayMultiplier.text = "Multiplier: x" + multiplier;
    displayScore.draw();
    displayMultiplier.draw();
}

function drawElements() {
    // Updates enemy positions and draws them on the game canvas
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].x += -1;
        enemies[i].draw();
    }
    // Updates garbage positions and draws them on the game canvas
    for (let i = 0; i < garbageArr.length; i++) {
        garbageArr[i].x += -1;
        garbageArr[i].draw();
    }
    // Updates hat position and draws it on the game canvas
    if (topHat) {
        topHat.x += -1;
        topHat.draw();
    }
    // Updates garbage clump position and draws it on the game canvas
    if (garbageClump) {
        garbageClump.x += -1;
        garbageClump.draw();
    }
    turtle.updatePosition();
    turtle.draw();
}

function checkCollision() {
    for (let i = 0; i < enemies.length; i++) {
        // Check if turtle has collided with enemy
        if (turtle.collidesWith(enemies[i])) {
            gameCanvas.stop();
            scoreToDB();
            document.getElementById('restart').style = "display: flex; z-index: 10";
            document.getElementById("score").innerHTML = "Score: " + score;
        }
        // remove enemy from array once it has gone off the screen
        if (enemies[i].x < -100) {
            enemies.splice(i, 1);
        }
    }
    // Check if turtle has collided with garbage
    for (let i = 0; i < garbageArr.length; i++) {
        if (turtle.collidesWith(garbageArr[i])) {
            garbageArr.splice(i, 1);
            score += multiplier;
        }
    }
    // Check if turtle has collided with top hat
    if (topHat && turtle.collidesWith(topHat)) {
        topHat = false;
        turtle.image.src = './images/dapper-sprite2.png';
    }
    // Check if turtle has collided with large garbage clump
    if (garbageClump && turtle.collidesWith(garbageClump)) {
        gameCanvas.stop();
        startTrivia();

    }
}

function addObjects() {
    // adds enemy sprite to the game canvas
    if (gameCanvas.frameNo === 1 || everyInterval(350)) {
        let enemyImages = ['./images/jelly-sprite2.png', './images/puffer-sprite5.png']; // enemy sprites
        let enemy = enemyImages[Math.floor(Math.random() * (enemyImages.length ))]; // Randomly selects enemy
        let x = gameCanvas.canvas.width;
        // Determines y-axis position of enemy spawn
        let enemyY = Math.floor(Math.random() * (gameCanvas.canvas.height - 400) + 150);
        if (enemy === './images/jelly-sprite2.png') {
            enemies.push(new Element(2800, 400, enemy, x, enemyY, "sprite", 7)); // Jellyfish
        } else {
            enemies.push(new Element(4365, 485, enemy, x, enemyY, "sprite", 9)); // Puffer fish
        }
    }

    // Adds garbage to game canvas
    if (gameCanvas.frameNo === 10 || everyInterval(300)) {
        let garbageImages = ['./images/paper_trans.png', './images/plastic_rings.png']; // garbage images
        let garbage = garbageImages[Math.floor(Math.random() * (garbageImages.length ))]; // Randomly selects garbage
        let x = gameCanvas.canvas.width;
        // Determines y-axis position of garbage spawn
        let garbageY = Math.floor(Math.random() * (gameCanvas.canvas.height - 400) + 150);
        garbageArr.push(new Element(70, 70, garbage, x, garbageY, "image"));
    }

    // Adds top hat easter egg to the game canvas
    if (gameCanvas.frameNo === 1500) {
        let x = gameCanvas.canvas.width;
        let y = gameCanvas.canvas.height - 135;
        topHat = new Element(70, 45, './images/top_hat.png', x, y, "image")
    }

    // Adds large garbage clump w/ trapped turtle in it to game canvas
    if (gameCanvas.frameNo === 50 || everyInterval(2500)) {
        let x = gameCanvas.canvas.width;
        // Determines y-axis position of garbage clump spawn
        let garbageY = Math.floor(Math.random() * (gameCanvas.canvas.height - 400) + 150);
        garbageClump = new Element(180, 180, './images/clump.png', x, garbageY, "image")
    }
}
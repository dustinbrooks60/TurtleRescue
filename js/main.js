let ctx;
let turtle;
let oceanBackground;
let enemies = [];
let garbageArr = [];
let garbageClump;
let displayScore;
let score;
let topHat;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

function drawText(text, x, y) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px consolas';
    ctx.fillText(text, x, y);
    ctx.strokeText(text, x, y);

}


function drawTint(x, y, w, h) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x, y, w, h);
}

function startGame() {
    enemies = [];
    garbageArr = [];
    document.getElementById("start").style.display = "none";
    document.getElementById("restart").style.display = "none";
    turtle = new Element(9600, 600, './images/turtle-sprite2.png', 10, 120, "sprite", 12);
    turtle.gravity = 0.08;
    oceanBackground = new Element(1800, windowHeight, './images/ocean_2.png', 0, 0, "background");
    displayScore = new Element("30px", "Consolas", "black", 10, 40, "text");
    score = 0;
    gameCanvas.start();
}

let gameCanvas = {
    canvas : document.createElement("canvas"),
    div : document.getElementById('play'),
    start : function() {
        this.canvas.width = windowWidth;
        this.canvas.height = windowHeight;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        // document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 15);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
};

function Element(width, height, color, x, y, type, num_frames) {
    this.type = type;
    if (type === "image" || type === "background" || type === "sprite") {
        this.image = new Image();
        this.image.src = color;
    }
    this.actual_width = width;
    this.actual_height = height;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.x = x;
    this.y = y;
    this.num_frames = num_frames;
    this.sprite_frame = 0;
    this.update = function() {
        ctx = gameCanvas.context;
        if (type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (type === "image" || type === "background") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
            if (type === "background") {
                ctx.drawImage(this.image,
                    this.x + this.width,
                    this.y,
                    this.width, this.height);
            }
        }
        else if (type === "sprite") {
            this.actual_width = (this.width / this.num_frames)/4;
            this.actual_height = this.height /4;
            ctx.drawImage(this.image, (this.sprite_frame * (this.width / this.num_frames)), 0,
                this.width / this.num_frames, this.height, this.x, this.y, this.actual_width, this.actual_height);

            // set frame rate
            if (gameCanvas.frameNo % 6 === 0) {
                if (this.sprite_frame === this.num_frames - 1) {
                    this.sprite_frame = 0;
                }
                else {
                    this.sprite_frame++;
                }
            }
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if (this.type === 'image' || this.type === "sprite") {
            this.gravitySpeed += this.gravity;
            if (this.gravitySpeed <-3) {
                this.gravitySpeed = -3
            }
            this.hitBottom();
            this.hitTop();
        }
        if (this.type === "background") {
            if (this.x === -(this.width)) {
                this.x = 0;
            }
        }
    };
    this.hitBottom = function() {
        let oceanFloor = gameCanvas.canvas.height - this.height + 425;
        if (this.y > oceanFloor) {
            this.y = oceanFloor;
            this.gravitySpeed = 0;
        }
        accelerate(0.1);
    };
    this.hitTop = function() {
        let oceanSurface = 80;
        if (this.y < oceanSurface){
            this.y = oceanSurface;
            this.gravitySpeed = 0;
        }
    };
    this.crashWith = function(otherobj) {
        let turtleLeft = this.x;
        let turtleRight = this.x + (this.actual_width);
        let turtleTop = this.y;
        let turtleBottom = this.y + (this.actual_height);
        let enemyLeft = otherobj.x + 85;
        let enemyRight = otherobj.x + (otherobj.actual_width) - 85;
        let enemyTop = otherobj.y + 85;
        let enemyBottom = otherobj.y + (otherobj.actual_height) - 75;
        let crash = true;
        if ((turtleBottom < enemyTop) || (turtleTop > enemyBottom) || (turtleRight < enemyLeft) || (turtleLeft > enemyRight)) {
            crash = false;
        }
        return crash;
    };
}

function clickManager(n){
    accelerate(n);
    console.log('clicked');
}

function accelerate(n){
    turtle.gravity = n;
}

function everyInterval(n) {
    return (gameCanvas.frameNo / n) % 1 === 0;

}

function updateGameArea() {
    for (let i = 0; i < enemies.length; i++) {
        if (turtle.crashWith(enemies[i])) {
            document.getElementById('restart').style = "display: flex; z-index: 10";
            document.getElementById("score").innerHTML = "Score: " + score;
            // drawTint(0, 0, gameCanvas.width, gameCanvas.height);
            // drawText('Game Over', windowWidth/2 - 75, windowHeight/2 - 100);
            // drawText('Score: ' + score, windowWidth/2- 70, windowHeight/2);
            gameCanvas.clear();
            gameCanvas.stop();

        }
    }
    for (let i = 0; i < garbageArr.length; i++) {
        if (turtle.crashWith(garbageArr[i])) {
            garbageArr.splice(i, 1);
            score ++;
        }
    }
    if (topHat && turtle.crashWith(topHat)) {
        topHat = false;
        turtle.image.src = './images/dapper-sprite2.png';
    }
    if (garbageClump && turtle.crashWith(garbageClump)) {
        garbageClump = false;
        score += 5;
    }
    gameCanvas.clear();
    gameCanvas.frameNo += 1;
    oceanBackground.speedX = -1;
    oceanBackground.newPos();
    oceanBackground.update();
    if (gameCanvas.frameNo === 1 || everyInterval(350)) {
        let enemyImages = ['./images/jelly-sprite2.png', './images/puffer-sprite5.png'];
        let enemy = enemyImages[Math.floor(Math.random() * (enemyImages.length ))];
        let x = gameCanvas.canvas.width;
        let enemyY = Math.floor(Math.random() * (gameCanvas.canvas.height - 400) + 150);
        if (enemy === './images/jelly-sprite2.png') {
            enemies.push(new Element(2800, 400, enemy, x, enemyY, "sprite", 7));
        } else {
            enemies.push(new Element(4365, 485, enemy, x, enemyY, "sprite", 9));
        }
    }

    if (gameCanvas.frameNo === 10 || everyInterval(300)) {
        let garbageImages = ['./images/paper_trans.png', './images/plastic_rings.png'];
        let garbage = garbageImages[Math.floor(Math.random() * (garbageImages.length ))];
        let x = gameCanvas.canvas.width;
        let garbageY = Math.floor(Math.random() * (gameCanvas.canvas.height - 400) + 150);
        garbageArr.push(new Element(70, 70, garbage, x, garbageY, "image"));
    }

    if (gameCanvas.frameNo === 1500) {
        let x = gameCanvas.canvas.width;
        let y = gameCanvas.canvas.height - 135;
        topHat = new Element(70, 45, './images/top_hat.png', x, y, "image")
    }

    if (gameCanvas.frameNo === 50 || everyInterval(2500)) {
        let x = gameCanvas.canvas.width;
        let garbageY = Math.floor(Math.random() * (gameCanvas.canvas.height - 400) + 150);
        garbageClump = new Element(180, 180, './images/clump.png', x, garbageY, "image")
    }

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].x += -1;
        enemies[i].update();
    }
    for (let i = 0; i < garbageArr.length; i++) {
        garbageArr[i].x += -1;
        garbageArr[i].update();
    }
    if (topHat) {
        topHat.x += -1;
        topHat.update();
    }
    if (garbageClump) {
        garbageClump.x += -1;
        garbageClump.update();
    }
    displayScore.text = "Garbage Collected:" + score;
    displayScore.update();
    turtle.newPos();
    turtle.update();
}
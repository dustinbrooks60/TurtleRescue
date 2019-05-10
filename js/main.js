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
let seconds;
let barValue;
let question;
let answer1;
let answer2;
let answer3;
let answer4;

let questionObj = {
    "Where does majority of plastic waste end up?": {
        "burned for energy": false,
        "oceans": true,
        "recycled": false,
        "landfills": false,
    }

};

let questionKey = Object.keys(questionObj);
let answerObject = questionObj[questionKey];
let answerArray = Object.keys(answerObject);
let copyAnswerArray;

function getAnswer(answerObj, answerArray){
    // gets the correct answer
    for(let i = 0; i < answerArray.length; i++){
        let find_answer = answerObj[answerArray[i]];
        if (find_answer === true){
            return answerArray[i]
        }
    }
}
function shuffle(array){
    array.sort(() => Math.random() - 0.5);
}
function displayTrivia(){
    question = document.getElementById('question');
    answer1 = document.getElementById('a1');
    answer2 = document.getElementById('a2');
    answer3 = document.getElementById('a3');
    answer4 = document.getElementById('a4');
    copyAnswerArray = answerArray.slice(0); // create a copy of the questions
    shuffle(copyAnswerArray); // shuffle the answers
    question.innerHTML = questionKey[0]; // index can be the length of how many questions to randomize
    answer1.innerHTML = copyAnswerArray[0];
    answer2.innerHTML = copyAnswerArray[1];
    answer3.innerHTML = copyAnswerArray[2];
    answer4.innerHTML = copyAnswerArray[3];
}

function resetTrivia(){
    question.innerHTML = ""; // index can be the length of how many questions to randomize
    answer1.innerHTML = "";
    answer2.innerHTML = "";
    answer3.innerHTML = "";
    answer3.innerHTML = "";
}
function countDown(intervalSec){
    seconds = intervalSec;
    let x = setInterval(function(){
        barValue = (seconds-1)*20;
        document.getElementById('time').style.width = String(barValue) + "%";
        document.getElementById('time').innerHTML = seconds-1 + "seconds left";
        if (seconds === 0){
            document.getElementById('time').style.width = String(100) + "%";
            document.getElementById('time').innerHTML = 5 + "seconds left";
            clearInterval(x);

        }else {
            seconds -= 1;
        }
    }, 1000)
}
function startGame() {
    score = 0;
    enemies = [];
    garbageArr = [];
    topHat = false;
    garbageClump = false;
    document.getElementById("start").style.display = "none";
    document.getElementById("restart").style.display = "none";
    document.getElementById("trivia").style.display = "none";
    turtle = new Element(9600, 600, './images/turtle-sprite2.png', 10, 120, "sprite", 12); // turtle object
    turtle.gravity = 0.08;
    oceanBackground = new Element(1800, windowHeight, './images/ocean_2.png', 0, 0, "background"); // game background
    displayScore = new Element("30px", "Consolas", "black", 10, 40, "text");
    gameCanvas.start(); // appends game canvas to the body
}

// creates the game canvas object
let gameCanvas = {
    canvas : document.createElement("canvas"),
    // Sets game canvas dimensions and appends it to the body
    start : function() {
        this.canvas.width = windowWidth;
        this.canvas.height = windowHeight;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        // document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 15); // clears and redraws game canvas every 15ms
    },
    // Clears the contents of the game canvas
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    // Stops updating the game canvas (when character collides with enemy)
    stop : function() {
        clearInterval(this.interval);
    },
    continue : function(){
        this.interval = setInterval(updateGameArea, 15);

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
    this.num_frames = num_frames; // number of frames in the sprite image
    this.sprite_frame = 0; // the particular frame number of the sprite image
    // redraws the all the game canvas, as well as all the elements in it
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
                this.width,
                this.height);
            if (type === "background") {
                ctx.drawImage(this.image,
                    this.x + this.width,
                    this.y,
                    this.width,
                    this.height);
            }
        }
        else if (type === "sprite") {
            this.actual_width = (this.width / this.num_frames)/4;
            this.actual_height = this.height /4;
            ctx.drawImage(this.image,
                (this.sprite_frame * (this.width / this.num_frames)),
                0,
                this.width / this.num_frames,
                this.height,
                this.x,
                this.y,
                this.actual_width,
                this.actual_height);

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
        else {
            // draws a rectangle if sprite image is unavailable
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    // Update the position of all the objects in the canvas
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if (this.type === 'image' || this.type === "sprite") {
            this.gravitySpeed += this.gravity;
            if (this.gravitySpeed <-3) { // caps gravity at -3
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
    // Detects if turtle hits the ocean floor
    this.hitBottom = function() {
        let oceanFloor = gameCanvas.canvas.height - this.height + 425;
        if (this.y > oceanFloor) {
            this.y = oceanFloor;
            this.gravitySpeed = 0;
        }
        accelerate(0.1);
    };
    // Detects if the turtle hits the ocean surface
    this.hitTop = function() {
        let oceanSurface = 80;
        if (this.y < oceanSurface){
            this.y = oceanSurface;
            this.gravitySpeed = 0;
        }
    };
    // Sets the hit boxes of turtle, enemies, and garbage and detects if they collide
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
        return crash; // Returns boolean status of a collision between a turtle and other object
    };
}

// Accelerates turtle upon screen touch
function clickManager(n){
    accelerate(n);
    console.log('clicked');
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
        console.log(enemies);
        console.log(enemiesCopy);
        if (enemiesCopy[i].x < (gameCanvas.canvas.width * 0.35) && enemiesCopy[i].y > (turtle.y - 25)) {
            enemies.splice(i, 1);
        }
    }
}

// Redraws the game canvas and all elements in it
function updateGameArea() {
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].x < -100) {
            enemies.splice(i, 1);
        }
    }

    // Check if turtle has collided with enemy
    for (let i = 0; i < enemies.length; i++) {
        if (turtle.crashWith(enemies[i])) {
            gameCanvas.stop();
            document.getElementById('restart').style = "display: flex; z-index: 10";
            document.getElementById("score").innerHTML = "Score: " + score;

        }
    }
    // Check if turtle has collided with garbage
    for (let i = 0; i < garbageArr.length; i++) {
        if (turtle.crashWith(garbageArr[i])) {
            garbageArr.splice(i, 1);
            score ++;
        }
    }
    // Check if turtle has collided with top hat
    if (topHat && turtle.crashWith(topHat)) {
        topHat = false;
        turtle.image.src = './images/dapper-sprite2.png';
    }
    // Check if turtle has collided with large garbage clump
    if (garbageClump && turtle.crashWith(garbageClump)) {
        let trivia = document.getElementById('trivia');
        gameCanvas.stop();
        trivia.style = "display: flex; z-index: 10";
        displayTrivia();
        countDown(5);
        setTimeout(function(){
            seconds = 5;
            trivia.style.display = "none";
            resetTrivia();
            garbageClump = false;
            clearNearbyEnemies()
        }, 6000);
        setTimeout(function() {
            gameCanvas.continue();
        }, 7000);
        score += 5;


    }

    gameCanvas.clear();
    gameCanvas.frameNo += 1;
    oceanBackground.speedX = -1;
    oceanBackground.newPos();
    oceanBackground.update();

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

    // Updates enemy positions and draws them on the game canvas
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].x += -1;
        enemies[i].update();
    }
    // Updates garbage positions and draws them on the game canvas
    for (let i = 0; i < garbageArr.length; i++) {
        garbageArr[i].x += -1;
        garbageArr[i].update();
    }
    // Updates hat position and draws it on the game canvas
    if (topHat) {
        topHat.x += -1;
        topHat.update();
    }
    // Updates garbage clump position and draws it on the game canvas
    if (garbageClump) {
        garbageClump.x += -1;
        garbageClump.update();
    }
    displayScore.text = "Garbage Collected:" + score;
    displayScore.update();
    turtle.newPos();
    turtle.update();
}
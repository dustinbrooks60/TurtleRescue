// Initialize variables
let ctx;
let turtle;
let oceanBackground;
let enemies;
let garbageArr;
let garbageClump;
let displayScore;
let multiplierIcon;
let displayMultiplier;
let score;
let multiplier;
let topHat;
let audio_music = new Audio('./sounds/aqualounge.mp3');
let audio_classical = new Audio('./sounds/allegro.mp3');


// Create main elements for game
function startGame() {
    audio_classical.pause();
    audio_classical.currentTime = 0;
    audio_music.play();
    resetGame();
    turtle = new GameElement(9600, 600, './images/turtle-sprite2.png', 10, 120, "sprite", 12); // turtle object
    turtle.gravity = 0.08;
    oceanBackground = new GameElement(1800, window.innerHeight, './images/ocean_2.png', 0, 0, "background"); // game background
    displayScore = new GameElement("20px", "Play", "black bold", 10, 30, "text");
    multiplierIcon = new GameElement(30, 20, './images/saved_turtle2.png', 10, 42, "image");
    displayMultiplier = new GameElement("20px", "Play", "black", 45, 60, "text");
    pullQuestion();
    gameCanvas.start(); // appends game canvas to the body
}

// Reset game elements for a new round of game play
function resetGame() {
    audio_music.pause();
    audio_music.currentTime = 0;
    audio_music.play();
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


// Accelerates turtle upon screen touch
function clickManager(n){
    accelerate(n);
    playSound_Bubble();
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
        if (enemiesCopy[i].x < (gameCanvas.canvas.width * 0.35) && enemiesCopy[i].y > (turtle.y - 100)) {
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
    displayScore.text = "Score : " + score;
    displayMultiplier.text = "x " + multiplier;
    multiplierIcon.draw();
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
            playSound_Oof();
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
        audio_music.pause();
        audio_classical.currentTime = 0;
        audio_classical.play();
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
            enemies.push(new GameElement(2800, 400, enemy, x, enemyY, "sprite", 7)); // Jellyfish
        } else {
            enemies.push(new GameElement(4365, 485, enemy, x, enemyY, "sprite", 9)); // Puffer fish
        }
    }

    // Adds garbage to game canvas
    if (gameCanvas.frameNo === 10 || everyInterval(300)) {
        let garbageImages = ['./images/paper_trans.png', './images/plastic_rings.png']; // garbage images
        let garbage = garbageImages[Math.floor(Math.random() * (garbageImages.length ))]; // Randomly selects garbage
        let x = gameCanvas.canvas.width;
        // Determines y-axis position of garbage spawn
        let garbageY = Math.floor(Math.random() * (gameCanvas.canvas.height - 400) + 150);
        garbageArr.push(new GameElement(70, 70, garbage, x, garbageY, "image"));
    }

    // Adds top hat easter egg to the game canvas
    if (gameCanvas.frameNo === 1500) {
        let x = gameCanvas.canvas.width;
        let y = gameCanvas.canvas.height - 135;
        topHat = new GameElement(70, 45, './images/top_hat.png', x, y, "image")
    }

    // Adds large garbage clump w/ trapped turtle in it to game canvas
    if (gameCanvas.frameNo === 50 || everyInterval(2500)) {
        let x = gameCanvas.canvas.width;
        // Determines y-axis position of garbage clump spawn
        let garbageY = Math.floor(Math.random() * (gameCanvas.canvas.height - 400) + 150);
        garbageClump = new GameElement(180, 180, './images/clump.png', x, garbageY, "image")
    }
}

function backHome(){
    audio_music.pause();
    audio_music.currentTime = 0;
    audio_classical.pause();
    audio_classical.currentTime = 0;
    document.getElementById('restart').style.display = "none";
    document.getElementById('start').style.display = "flex";
    gameCanvas.clear()
}
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
let milliseconds;
let timeLeft;
let userChoice;
let randomQuestion;

// Trivia display
let questionDisplay = document.getElementById('question');
let answer1 = document.getElementById('a1');
let answer2 = document.getElementById('a2');
let answer3 = document.getElementById('a3');
let answer4 = document.getElementById('a4');

let question;
let answerObject;
let answerArray;
let copyAnswerArray;

// Pull random question from database
function pullQuestion() {
    let num = Math.ceil(Math.random() * 15);
    let dbRef = firebase.database().ref('/questions/' + 'question' + num);
    dbRef.once('value').then(function(snapshot){
        randomQuestion = snapshot.val();
    });
    return randomQuestion
}

// Identifies elements of question object pulled from database
function generateQuestion(){
    pullQuestion();
    question = Object.keys(randomQuestion); // question length 1 array of question type:string
    answerObject = randomQuestion[question];
    answerArray = Object.keys(answerObject); // answerArray contain answers of type string
}

// Return the correct answer
function getAnswer(answerObj, answerArray){
    for(let i = 0; i < answerArray.length; i++){
        let answer = answerObj[answerArray[i]];
        if (answer === true){
            return answerArray[i]
        }
    }
}

// Shuffle trivia answers for display
function shuffle(array){
    array.sort(() => Math.random() - 0.5);
}

// Display trivia question and shuffled answers
function displayTrivia(){
    copyAnswerArray = answerArray.slice(0); // create a copy of the questions
    shuffle(copyAnswerArray); // shuffle the answers
    questionDisplay.innerHTML = question[0]; // index can be the length of how many questions to randomize
    answer1.innerHTML = copyAnswerArray[0];
    answer2.innerHTML = copyAnswerArray[1];
    answer3.innerHTML = copyAnswerArray[2];
    answer4.innerHTML = copyAnswerArray[3];
    isCorrectAnswer();
}

// Return true if user's choice is correct
function isCorrectAnswer(){
    getUserChoice(); // check for correct user selection
    setTimeout(function(){
        if (userChoice === getAnswer(answerObject, copyAnswerArray)){
            console.log("correct answer!") // do this if user choice is correct
        } else{
            console.log("wrong!")
        }
    },5000); // timeout determine by countDown interval


}
// Get the innerHTML value of button clicked and assign to userChoice
function getUserChoice(){
    answer1.onclick = function(){userChoice = answer1.innerHTML};
    answer2.onclick = function(){userChoice = answer2.innerHTML};
    answer3.onclick = function(){userChoice = answer3.innerHTML};
    answer4.onclick = function(){userChoice = answer4.innerHTML};
    return userChoice;
}

// Clear trivia question, answers, and progress bar
function clearTrivia(){
    document.getElementById('time').style.width = String(100) + "%";
    questionDisplay.innerHTML = ""; // index can be the length of how many questions to randomize
    answer1.innerHTML = "";
    answer2.innerHTML = "";
    answer3.innerHTML = "";
    answer3.innerHTML = "";
}

// Create a countdown for user with a progress bar.
function countDown(intervalSec){
    let eachInterval = intervalSec * 10;
    let percentage = 100;
    let timeBarInterval = setInterval(function(){
        document.getElementById('time').style.width = String(percentage) + "%";
        if (percentage === 0){
            clearInterval(timeBarInterval);
        }else {
            percentage -= 1;
        }
    }, eachInterval)
}

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
        this.interval = setInterval(updateGameArea, 15); // clears and redraws game canvas every 15ms
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
        this.interval = setInterval(updateGameArea, 15);

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
    this.update = function() {
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
    this.newPos = function() {
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
function updateGameArea() {
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].x < -100) {
            enemies.splice(i, 1);
        }
    }

    // Check if turtle has collided with enemy
    for (let i = 0; i < enemies.length; i++) {
        if (turtle.collidesWith(enemies[i])) {
            gameCanvas.stop();
            document.getElementById('restart').style = "display: flex; z-index: 10";
            document.getElementById("score").innerHTML = "Score: " + score;
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
        garbageClump = false;
        let trivia = document.getElementById('trivia');
        generateQuestion();
        gameCanvas.stop();
        trivia.style = "display: flex; z-index: 10";
        displayTrivia();
        countDown(10);
        setTimeout(function(){
            milliseconds = 5;
            trivia.style.display = "none";
            clearTrivia();
            garbageClump = false;
            clearNearbyEnemies()
        }, 11000);
        setTimeout(function() {
            gameCanvas.continue();
        }, 11001);
        multiplier ++;


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
    displayMultiplier.text = "Multiplier: x" + multiplier;
    displayScore.update();
    displayMultiplier.update();
    turtle.newPos();
    turtle.update();
}
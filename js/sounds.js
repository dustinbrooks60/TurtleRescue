// Initialize Variables
let soundID_Bubble = "Bubble";
let soundID_Oof = "Oof";
let soundID_Point = "Point";
let soundID_Correct = "Correct";
let soundID_Incorrect = "Incorrect";
let soundID_Classical = "Classical";
let soundID_Music = "Music";

// Load sounds into the HTML file
function loadSound () {
    createjs.Sound.registerSound("./sounds/bubble.mp3", soundID_Bubble);
    createjs.Sound.registerSound("./sounds/oof.mp3", soundID_Oof);
    createjs.Sound.registerSound("./sounds/point.mp3", soundID_Point);
    createjs.Sound.registerSound("./sounds/trivia-correct.mp3", soundID_Correct);
    createjs.Sound.registerSound("./sounds/trivia-incorrect.mp3", soundID_Incorrect);
    createjs.Sound.registerSound("./sounds/allegro.mp3", soundID_Classical);
    createjs.Sound.registerSound("./sounds/aqualounge.mp3", soundID_Music);

}


// Play the bubble sound
function playSound_Bubble () {
    createjs.Sound.play(soundID_Bubble);
}

// Play oof sound
function playSound_Oof () {
    createjs.Sound.play(soundID_Oof);
}

// Play garbage collect sound
function playSound_Point () {
    createjs.Sound.play(soundID_Point);
}

// Play correct trivia sound
function playSound_Correct() {
    createjs.Sound.play(soundID_Correct);
}

// Play incorrect trivia sound
function playSound_Incorrect() {
    createjs.Sound.play(soundID_Incorrect);
}

function playSound_Classical() {
    createjs.Sound.play(soundID_Classical, {loop: -1});
}

function playSound_Music() {
    createjs.Sound.play(soundID_Music, {loop: -1});
}

function stopAllSound() {
    createjs.Sound.stop();
}
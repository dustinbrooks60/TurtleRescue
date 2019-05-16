// Initialize Variables
let soundID_Bubble = "Bubble";
let soundID_Oof = "Oof";
let soundID_Point = "Point";
let soundID_Correct = "Correct";


// Load sounds into the HTML file
function loadSound () {
    createjs.Sound.registerSound("./sounds/bubble.mp3", soundID_Bubble);
    createjs.Sound.registerSound("./sounds/oof.mp3", soundID_Oof);
    createjs.Sound.registerSound("./sounds/point.mp3", soundID_Point);
    createjs.Sound.registerSound("./sounds/trivia-correct.mp3", soundID_Correct);


}


// Play the bubble noise
function playSound_Bubble () {
    createjs.Sound.play(soundID_Bubble);
}

// Play oof noise
function playSound_Oof () {
    createjs.Sound.play(soundID_Oof);
}

function playSound_Point () {
    createjs.Sound.play(soundID_Point);
}

function playSound_Correct() {
    createjs.Sound.play(soundID_Correct);
}

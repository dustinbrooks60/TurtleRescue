// Initialize Variables
let soundID_Music = "Music";
let soundID_Bubble = "Bubble";
let soundID_Oof = "Oof";
let soundID_Classical = "Classical";

// Load sounds into the HTML file
function loadSound () {
    createjs.Sound.registerSound("./sounds/aqualounge.mp3", soundID_Music);
    createjs.Sound.registerSound("./sounds/bubble.mp3", soundID_Bubble);
    createjs.Sound.registerSound("./sounds/oof.mp3", soundID_Oof)
    createjs.Sound.registerSound("./sounds/allegro.mp3", soundID_Oof)

}


// Play the background music
function playSound_Music () {
    createjs.Sound.play(soundID_Music);
}

// Play the bubble noise
function playSound_Bubble () {
    createjs.Sound.play(soundID_Bubble);
}

// Play oof noise
function playSound_Oof () {
    createjs.Sound.play(soundID_Oof);
}

function playSound_Classical () {
    createjs.Sound.play(soundID_Classical);
}
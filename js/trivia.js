let trivia;
let userChoice;
let randomQuestion;

function startTrivia() {
    trivia = document.getElementById('trivia');
    generateQuestion();
    trivia.style = "display: flex; z-index: 10";
    displayTrivia();
    triviaHandler(10);
}

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
    let num = Math.ceil(Math.random() * 14);
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

// Shuffle Trivia answers for display
function shuffle(array){
    array.sort(() => Math.random() - 0.5);
}

// Display Trivia question and shuffled answers
function displayTrivia(){
    copyAnswerArray = answerArray.slice(0); // create a copy of the questions
    shuffle(copyAnswerArray);// shuffle the answers
    if (question[0].length > 50){ // Changes font size of question if too big
        questionDisplay.style.fontSize = 1.25 + 'em';
    }
    else {
        questionDisplay.style.fontSize = 1.5 + 'em';
    }
    questionDisplay.innerHTML = question[0]; // index can be the length of how many questions to randomize
    answer1.innerHTML = copyAnswerArray[0];
    answer2.innerHTML = copyAnswerArray[1];
    answer3.innerHTML = copyAnswerArray[2];
    answer4.innerHTML = copyAnswerArray[3];
    getUserChoice();
}

// Get the innerHTML value of button clicked and assign to userChoice
function getUserChoice(){
    answer1.onclick = function(){userChoice = answer1.innerHTML};
    answer2.onclick = function(){userChoice = answer2.innerHTML};
    answer3.onclick = function(){userChoice = answer3.innerHTML};
    answer4.onclick = function(){userChoice = answer4.innerHTML};
    return userChoice;
}

// Clear Trivia question, answers, and progress bar
function clearTrivia(){
    document.getElementById('time').style.width = String(100) + "%";
    questionDisplay.innerHTML = ""; // index can be the length of how many questions to randomize
    userChoice = undefined;
    $(document).ready(function(){
        let answers = $(".answers");
        answers.css({"background-color": "#119EDC"}); // reset background color for answers
        answers.html("");
        answers.css({"visibility": "visible"});
        $("#trivia-title").html("Trivia Time!");
        $("#trivia-title").css({"color": "white"});
    })
}

const sleep = (milliseconds)=> {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};
// Create a countdown for user with a progress bar.
function triviaHandler(seconds){
    let eachInterval = seconds * 10;
    let percentage = 100;
    let timeBarInterval = setInterval(function(){
        document.getElementById('time').style.width = String(percentage) + "%";
        if (percentage === -5 || userChoice !== undefined){
            displayAnswer();
            clearInterval(timeBarInterval);
            garbageClump = false;
            clearNearbyEnemies();
             sleep(3000).then(() => {
                    clearTrivia();
                    trivia.style.display = "none";
                    countDown();
                })

        }else {
            percentage -= 1;
        }
    }, eachInterval)
}

function countDown() {
    var i = 4;
    let count = setInterval(function (){
        document.getElementById("count" + String(i)).style= "display: none;";
        i--;
        document.getElementById("count" + String(i)).style = "display: inline; z-index: 50;";
        if (i === 0){
            clearInterval(count);
        }
    },  700);



    // for (let i = 3; i > 0; i--) {
    //     setTimeout (function() {
    //         document.getElementById("count" + String(i + 1)).style= "display: none;";
    //         document.getElementById("count" + String(i)).style = "display: inline; z-index: 50;";
    //     }, 1000);
    // }
    setTimeout(function() {
        document.getElementById("count0").style= "display: none;";
        gameCanvas.continue();
    }, 3500);

}

function displayAnswer(){
    let answerArray = document.getElementsByClassName("answers");
    for (let i = 0; i < answerArray.length; i++){
        let answer = answerArray[i].innerHTML;
        if (answer === getAnswer(answerObject, copyAnswerArray)) {
            answerArray[i].style.backgroundColor = "#2EB518";
        }
        if (answer !== userChoice && answer !== getAnswer(answerObject, copyAnswerArray)) {
            answerArray[i].style.visibility = "hidden";
        }
    }
    if (userChoice === getAnswer(answerObject, copyAnswerArray)) {
        multiplier ++;
        document.getElementById("trivia-title").innerHTML = "Correct!";
        document.getElementById("trivia-title").style.color = "#47C034";
    } else {
        document.getElementById("trivia-title").innerHTML = "Incorrect!";
        document.getElementById("trivia-title").style.color = "red";
    }
}
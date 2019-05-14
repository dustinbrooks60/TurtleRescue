let trivia;
let userChoice;
let randomQuestion;

function startTrivia() {
    trivia = document.getElementById('trivia');
    generateQuestion();
    trivia.style = "display: flex; z-index: 10";
    displayTrivia();
    countDown(10);
    multiplier ++;
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

// Shuffle Trivia answers for display
function shuffle(array){
    array.sort(() => Math.random() - 0.5);
}

// Display Trivia question and shuffled answers
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

// Clear Trivia question, answers, and progress bar
function clearTrivia(){
    document.getElementById('time').style.width = String(100) + "%";
    questionDisplay.innerHTML = ""; // index can be the length of how many questions to randomize
    userChoice = undefined;
    $(document).ready(function(){
        let answers = $(".answers");
        answers.css({"background-color": "initial", "opacity": 1}); // reset background color for answers
        answers.html("")
    })
}

// Create a countdown for user with a progress bar.
function countDown(intervalSec){
    let eachInterval = intervalSec * 10;
    let percentage = 100;
    let timeBarInterval = setInterval(function(){
        document.getElementById('time').style.width = String(percentage) + "%";
        if (percentage === 0 || userChoice !== undefined){
            displayAnswer();
            clearInterval(timeBarInterval);
            garbageClump = false;
            clearNearbyEnemies();
            setTimeout( function() {
                    clearTrivia();
                    trivia.style.display = "none";
                    gameCanvas.continue();
                }
            ,5000)
        }else {
            percentage -= 1;
        }
    }, eachInterval)
}

function displayAnswer(){
    let answerArray = document.getElementsByClassName("answers");
    for (let i = 0; i < answerArray.length; i++){
        let answers = answerArray[i].innerHTML;
        if (answers === getAnswer(answerObject, copyAnswerArray)) {
            answerArray[i].style.backgroundColor = "green";
        }
        if (answers === userChoice && answers !== getAnswer(answerObject, copyAnswerArray)) {
            answerArray[i].style.backgroundColor = "#119EDC"
        }
    }
}
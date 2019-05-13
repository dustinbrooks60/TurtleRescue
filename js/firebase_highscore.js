const scoresRoot = firebase.database().ref().child('scores');
const userid = "user" + prompt("Please enter your ID number:", "420");
const myScoreRoot = firebase.database().ref().child('scores').child(userid);
const myScore = document.querySelector('#my-score');
const topScore = document.querySelector('#top-score');


// Set up score in database
var scoreJSONobj = {};
scoresRoot.on('value', (snapshot) => {
    let scoreData = snapshot.val();
    console.log('1');
    if (scoreData[userid] === undefined) {
        console.log('2');
        scoreJSONobj.currentScore = 0;
        myScoreRoot.set(scoreJSONobj);
    }
    else {
        console.log(scoreData);
        console.log(scoreData[userid] + 'WHAT?');
        scoreJSONobj.currentScore = scoreData[userid].currentScore;
    };
});


// Top score grabber:
scoresRoot.on('value', (snapshot) => {
    let scoreData = snapshot.val();
    var highestScore = -10000;
    var highestUser = "";
    Object.keys(scoreData).forEach(function(k){
        if (scoreData[k].currentScore > highestScore){
            highestScore = scoreData[k].currentScore; highestUser = k;
        }
    });
    console.log(highestScore+" by "+highestUser);
});

function scoreToDB(){
    if (scoreJSONobj.currentScore < score) {
        scoreJSONobj.currentScore = score;
        myScoreRoot.set(scoreJSONobj);
    }
    console.log(scoreJSONobj.currentScore + ' (' + userid + ')');
}
var userName;
var userId;
let leaderboardArr = [];
let topFiveArr;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        userName = user.displayName;
        var isAnonymous = user.isAnonymous;
        userId = user.uid;
    } else {
        // User is signed out.
    }
});

var scoresRoot = firebase.database().ref().child('scores');
// Set up score in database
var infoJSONobj = {};

scoresRoot.on('value', (snapshot) => {
    let playerData = snapshot.val();
    if (playerData[userId] === undefined) {
        infoJSONobj.bestScore = 0;
        infoJSONobj.userName = userName;
        firebase.database().ref().child('scores').child(userId).set(infoJSONobj);

    }
    else {
        infoJSONobj.bestScore = playerData[userId].bestScore;
    }
});

// Top score grabber:
scoresRoot.on('value', (snapshot) => {
    let playerData = snapshot.val();
    var highestScore = -10000;
    var highestUser = "";
    Object.keys(playerData).forEach(function(k){
        leaderboardArr.push(playerData[k]); // create an array of the objects
        if (playerData[k].bestScore > highestScore){

            highestScore = playerData[k].bestScore; highestUser = playerData[k].userName;
        }
    });
    sortScore();
    topFiveArr = leaderboardArr.slice(leaderboardArr.length - 5); // get the top five users
    populateLeaderBoard();
    console.log("Top score is " + highestScore+" by "+highestUser);

});

function scoreToDB(){
    if (infoJSONobj.bestScore < score) {
        try {
            infoJSONobj.bestScore = score;
            infoJSONobj.userName = userName;
            firebase.database().ref().child('scores').child(userId).set(infoJSONobj);
        }
        catch(err) {
            console.log(err.message);
        }

    }
    console.log('You got ' + infoJSONobj.bestScore);
}

function sortScore(){
    leaderboardArr.sort(function(a,b){
        return a.bestScore - b.bestScore
    });
}

function populateLeaderBoard(){
    $(document).ready(function(){
        $("#top1Name").html(topFiveArr[4].userName); $("#top1Score").html(topFiveArr[4].bestScore);
        $("#top2Name").html(topFiveArr[3].userName); $("#top2Score").html(topFiveArr[3].bestScore);
        $("#top3Name").html(topFiveArr[2].userName); $("#top3Score").html(topFiveArr[2].bestScore);
        $("#top4Name").html(topFiveArr[1].userName); $("#top4Score").html(topFiveArr[1].bestScore);
        $("#top5Name").html(topFiveArr[0].userName); $("#top5Score").html(topFiveArr[0].bestScore);
    })
}




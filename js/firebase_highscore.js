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
    leaderboardArr = [];
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
    if (leaderboardArr.length >= 5) {
        topFiveArr = leaderboardArr.slice(leaderboardArr.length - 5); // get the top five users
    } else {
        topFiveArr = leaderboardArr.slice();
    }
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
    topFiveArr.reverse();
    $(document).ready(function(){
        for (let i = 0; i < topFiveArr.length; i++){
            $("#top" + String(i+1) + "Name").html(topFiveArr[i].userName);
            $("#top" + String(i+1) +"Score").html(topFiveArr[i].bestScore);
        }
        for (let j = topFiveArr.length; j < 5; j++){ // to clear the loading if topFiveArr.length < 5
            $("#top" + String(j+1) + "Name").html("");
            $("#top" + String(j+1) +"Score").html("");
        }
    })
}




var userName;
var userId;

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
        if (playerData[k].bestScore > highestScore){
            highestScore = playerData[k].bestScore; highestUser = playerData[k].userName;
        }
    });
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

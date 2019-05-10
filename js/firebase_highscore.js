// const scoresRoot = firebase.database().ref().child('scores');
// const userid = "user" + prompt("Please enter your ID number:", "420");;
// const myScoreRoot = firebase.database().ref().child('scores').child(userid);
// const myScore = document.querySelector('#my-score');
// const topScore = document.querySelector('#top-score');
//
// var scoreDB = 0;
// var scoreJSONobj = {};
// myScore.innerHTML = scoreDB + ' (' + userid + ')';
// // Set up score in database
// scoreJSONobj.score = scoreDB;
// myScoreRoot.set(scoreJSONobj);
//
// // Top score grabber:
// scoresRoot.on('value', (snapshot) => {
//     let scoreData = snapshot.val();
//     var highestScore = -10000;
//     var highestUser = "";
//     Object.keys(scoreData).forEach(function(k){
//         if (scoreData[k].score > highestScore){
//             highestScore = scoreData[k].score; highestUser = k;
//         }
//     });
//     topScore.innerHTML = highestScore+" by "+highestUser;
//     console.log('yo')
// });

//
// // Update display with info from database
// // Store a reference to where we will display the color we get back from the database
// const colorContent = document.querySelector('#color-square');
// const colorDescription = document.querySelector('#color-description');
// colorRoot.on('value', (snapshot) => {
//     let colorData = snapshot.val();
//     colorDescription.innerHTML = colorData.colorDescription;
//     colorContent.style.backgroundColor = colorData.colorValue;
// });
//
//
// // Store a reference to the red and green buttons so we can easily add
// //  click events to them later
// const redButton = document.querySelector('.myButtonRed');
// const greenButton = document.querySelector('.myButtonGreen');
// const orangeButton = document.querySelector('.myButtonOrange');
//
// //Red Button Click Event
// redButton.addEventListener('click', (e) => {
//     e.stopPropagation();
//     //Put your code here to update the firebase database with color red.
//     var JSONobj = {};
//     JSONobj.colorDescription = "Red";
//     JSONobj.colorValue = "#de1000"; colorRoot.set(JSONobj);
//     colorContent.style.backgroundColor = "#de1000";
//     colorDescription.innerHTML = "Red";
//
//     scoreDB = scoreDB - 5;
//     scoreJSONobj.score = scoreDB;
//     myScoreRoot.set(scoreJSONobj);
//     myScore.innerHTML = scoreDB + ' (' + userid + ')';
// });
//
// //Green Button Click Event
// greenButton.addEventListener('click', (e) => {
//     e.stopPropagation();
//     console.log("Green Button Pressed.");
//     //Put your code here to update the firebase database with color green.
//     var JSONobj = {};
//     JSONobj.colorDescription = "Green"; JSONobj.colorValue = "#15ba10"; colorRoot.set(JSONobj);
//
//     colorContent.style.backgroundColor = "#15ba10";
//     colorDescription.innerHTML = "Green";
//
//     scoreDB = scoreDB + 5;
//     scoreJSONobj.score = scoreDB;
//     myScoreRoot.set(scoreJSONobj);
//     myScore.innerHTML = scoreDB + ' (' + userid + ')';
// });
//
// //Orange Button Click Event
// orangeButton.addEventListener('click', (e) => {
//     e.stopPropagation();
//     console.log("Orange Button Pressed.");
//     //Put your code here to update the firebase database with color orange.
//     var JSONobj = {};
//     JSONobj.colorDescription = "Orange"; JSONobj.colorValue = "#de7610"; colorRoot.set(JSONobj);
//
//     colorContent.style.backgroundColor = "#de7610";
//     colorDescription.innerHTML = "Orange";
//
//     scoreDB = 0;
//     scoreJSONobj.score = scoreDB;
//     myScoreRoot.set(scoreJSONobj);
//     myScore.innerHTML = scoreDB + ' (' + userid + ')';
// });
//
//

var provider = new firebase.auth.GoogleAuthProvider(); // create an instance for google provider
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {

    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'redirect',
    signInSuccessUrl: 'index.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            scopes: [
                'https://www.googleapis.com/auth/contacts.readonly'
            ],
            customParameters: {
                // Forces account selection even when one account
                // is available.
                prompt: 'select_account'
            }
        },
        {
            provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            scopes: [
                'public_profile',
                'email',
                'user_likes',
                'user_friends'
            ],
            customParameters: {
                // Forces password re-entry.
                auth_type: 'reauthenticate'
            }
        },
        firebase.auth.EmailAuthProvider.PROVIDER_ID

    ],
// Terms of service url.
    tosUrl: 'index.html',
// Privacy policy url.
    privacyPolicyUrl: 'index.html'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // ...
        showUserName(displayName);
        document.getElementById('firebaseui-auth-container').style.display = 'none';
        document.getElementById('logout').style.display = 'inline-block';
    } else {
        document.getElementById('userName').innerHTML = "";
        document.getElementById('logout').style.display = 'none';
        document.getElementById('firebaseui-auth-container').style.display = 'inline-block';

    }
});

firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // ...
    }
    // The signed-in user info.
    var user = result.user;
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
});

function signOut() {
    firebase.auth().signOut();
    console.log('shit')
}

function showUserName(user_name){
    let name = user_name.trim().split(" ");
    document.getElementById('userName').innerHTML = "Welcome, " + name[0];
}
angular.module('enforcementApp')
  .controller('loginCtrl', ['$state', loginController])


function loginController($state) {
  console.log("in login ctrl")
  var lCtrl = this
  lCtrl.title = "Login Controller"

  lCtrl.signInUser = function () {
    console.log('Starting sign in ...')
    var user = document.getElementById('loginUser').value;
    var password = document.getElementById('loginPassword').value;
    // console.log(user, password)
    firebase.auth().signInWithEmailAndPassword(user, password).catch(function(error) {
      // Handle Errors here.
      console.log('Error logging in...')
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });

     if(window.innerWidth <= 800 ) {
       console.log(window.innerWidth)
       $state.go('field');
     } else {
       $state.go('home');
     }

  }

}

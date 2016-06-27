angular.module('enforcementApp')
  .controller('navCtrl', ['$timeout', navController])

function navController($timeout) {
  console.log("in nav ctrl")
  var nCtrl = this
  nCtrl.title = "Nav Controller"
  nCtrl.appName = "Enforcement"
  nCtrl.isLoggedIn = false;

  if (firebase.auth().currentUser === null) {
    $timeout(function() {
      if (firebase.auth().currentUser !== null) {
        nCtrl.user = firebase.auth().currentUser;
      }
      // console.log(firebase.auth().currentUser)
    },100)
  }

  nCtrl.loggingIn = function () {
    nCtrl.user = firebase.auth().currentUser;
  }

  nCtrl.signOut = function () {
    firebase.auth().signOut().then(function() {
    }, function(error) {
      // An error happened.
    });
  }



  nCtrl.links = [
    {
      name: 'Home',
      isActive: true
    },
    {
      name: 'About',
      isActive: false
    },
    {
      name: 'Incidents',
      isActive: false
    },
    {
      name: 'DOJ',
      isActive: false
    },
    {
      name: 'Crime-Map',
      isActive: false
    },
    {
      name: 'Field',
      isActive: false
    }
  ]

  nCtrl.footerLinks = [
    {
      name: 'Government',
      links: [
        {
          linkName: 'Local Government',
          linkUrl: '#'
        },
        {
          linkName: 'County Government',
          linkUrl: '#'
        },
        {
          linkName: 'Federal Government',
          linkUrl: '#'
        }
      ]
    },
    {
      name: 'Partners',
      links: [
        {
          linkName: 'Local Government',
          linkUrl: '#'
        },
        {
          linkName: 'County Government',
          linkUrl: '#'
        },
        {
          linkName: 'Federal Government',
          linkUrl: '#'
        }
      ]
    },
    {
      name: 'Resources',
      links: [
        {
          linkName: 'Local Government',
          linkUrl: '#'
        },
        {
          linkName: 'County Government',
          linkUrl: '#'
        },
        {
          linkName: 'Federal Government',
          linkUrl: '#'
        }
      ]
    }
  ]


  nCtrl.changeActive = function(passedLink) {
    for (link of nCtrl.links) {
      if (passedLink === link) {
        link.isActive = true
      } else {
        link.isActive = false;
      }
    }
  }
}

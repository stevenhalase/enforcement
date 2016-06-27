angular.module('enforcementApp', ['ui.router'])
  .config(enforcementRouter)

enforcementRouter.$inject = ['$stateProvider', '$urlRouterProvider']

function enforcementRouter($stateProvider,$urlRouterProvider) {
  $stateProvider
    .state('login', {
      url         : '/',
      templateUrl : 'partials/login.html',
      controller  : 'loginCtrl as lCtrl'
    })
    .state('home', {
      url         : '/home',
      templateUrl : 'partials/home.html',
      controller  : 'homeCtrl as hCtrl'
    })
    .state('about', {
      url         : '/about',
      templateUrl : 'partials/about.html',
      controller  : 'aboutCtrl as aCtrl'
    })
    .state('incidents', {
      url         : '/incidents',
      templateUrl : 'partials/incidents.html',
      controller  : 'incidentsCtrl as iCtrl'
    })
    .state('doj', {
      url         : '/doj',
      templateUrl : 'partials/doj.html',
      controller  : 'dojCtrl as dCtrl'
    })
    .state('crime-map', {
      url         : '/crime-map',
      templateUrl : 'partials/crime-map.html',
      controller  : 'crime-mapCtrl as cmCtrl'
    })
    .state('field', {
      url         : '/field',
      templateUrl : 'partials/field.html',
      controller  : 'fieldCtrl as fCtrl'
    })

    $urlRouterProvider.otherwise('/')
}




angular.module('enforcementApp')
  .controller('aboutCtrl', aboutController)
  .factory('DataFactory', dataFactory)





function aboutController() {
  console.log("in about ctrl")
  var aCtrl = this
  aCtrl.title = "About Controller"
}

function dataFactory($http) {
  var promise;
  var jsondata = {
    get: function() {
      if ( !promise ) {
        var promise =  $http.get('MOCK_DATA.json')
        return promise;
      }
    }
  };
  return jsondata;
}

var config = {
  apiKey: "AIzaSyC7pd0QhuA-HWm98cqpMMN4kgTPZitpmlc",
  authDomain: "project-3036864184651045733.firebaseapp.com",
  databaseURL: "https://project-3036864184651045733.firebaseio.com",
  storageBucket: "",
};

firebase.initializeApp(config);
var database = firebase.database();
console.log(database)


// google.maps.event.addDomListener(window, 'load', function () {
//     var places = new google.maps.places.Autocomplete(document.getElementById('inputAddress'));
//     console.log(places)
//     google.maps.event.addListener(places, 'place_changed', function () {
//         var place = places.getPlace();
//         var address = place.formatted_address;
//         var latitude = place.geometry.location.A;
//         var longitude = place.geometry.location.F;
//         var mesg = "Address: " + address;
//         mesg += "\nLatitude: " + latitude;
//         mesg += "\nLongitude: " + longitude;
//         alert(mesg);
//     });
// });

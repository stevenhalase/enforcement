angular.module('enforcementApp')
  .controller('dojCtrl', ['$http', '$sce', dojController])


function dojController($http, $sce) {
  var dCtrl = this;
  dCtrl.dojPRData = {};
  dCtrl.dojSpeechData = {};

  dCtrl.title = "DOJ";

  $http.get('http://www.justice.gov/api/v1/speeches.json?&sort=date&direction=DESC&pagesize=1')
    .then(function(results) {
      console.log(results);
      dCtrl.dojSpeechData = results.data.results;
    });

  $http.get('http://www.justice.gov/api/v1/press_releases.json?&sort=date&direction=DESC&pagesize=1')
    .then(function(results) {
      console.log(results);
      dCtrl.dojPRData = results.data.results;
    });

  dCtrl.toTrustedHTML = function(html){
      return $sce.trustAsHtml(html);
  }

}

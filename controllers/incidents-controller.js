angular.module('enforcementApp')
  .controller('incidentsCtrl', ['DataFactory','$scope','$http', incidentsController])

function incidentsController(DataFactory, $scope, $http) {
  console.log("in incidents ctrl")

  var iCtrl = this;

  iCtrl.data = [];

  DataFactory.get().then(function(d) {
      iCtrl.data = d.data;

      for(entry in iCtrl.data) {
        // console.log(entry)
        iCtrl.data[entry].incident_date = new Date(iCtrl.data[entry].incident_date);
        // console.log(iCtrl.data[entry])
      }

    iCtrl.mostRecentIncident = findMostRecent(iCtrl.data);
    // console.log(iCtrl.mostRecentIncident)


    // console.log(iCtrl.data);

    iCtrl.maxPg = Math.floor(iCtrl.data.length / iCtrl.pgSize);
    iCtrl.pages = new Array(iCtrl.maxPg);
    // console.log(iCtrl.pages)


    function findMostRecent(data) {
      // console.log(data[0])
      var mostRecentIncident = data[0];
      var mostRecentDate = new Date(data[0].incident_date);
      for (incident of data) {
        var date = new Date(incident.incident_date);
        var timeDiff = date.getTime() - mostRecentDate.getTime();
        // console.log(timeDiff)
        if (timeDiff > 0) {
          mostRecentIncident = incident;
          mostRecentDate = date;
          // console.log(mostRecentIncident)
        }
      }
      // console.log(mostRecentDate)
      return mostRecentIncident;
    }

      (function(innerIncident){
      // console.log(incident.incident_type)
      GMaps.geocode({
        address: innerIncident.street_address,
        callback: function(results, status) {
          if (status == 'OK') {
            // console.log(results)
            var latlng = results[0].geometry.location;
            // console.log("adding marker...", innerIncident.incident_type)
            panorama = GMaps.createPanorama({
              el: '#panorama',
              lat : latlng.lat(),
              lng : latlng.lng(),
              pov: {
                heading: 0,
                pitch: -10
              }
            });
            iCtrl.spinner.stop()
          }
          }
        });
      })(iCtrl.mostRecentIncident);
  });

  iCtrl.todaysDate = new Date();

  var opts = {
    lines: 5 // The number of lines to draw
  , length: 30 // The length of each line
  , width: 12 // The line thickness
  , radius: 10 // The radius of the inner circle
  , scale: 1 // Scales overall size of the spinner
  , corners: 1 // Corner roundness (0..1)
  , color: '#fff' // #rgb or #rrggbb or array of colors
  , opacity: 0.25 // Opacity of the lines
  , rotate: 0 // The rotation offset
  , direction: 1 // 1: clockwise, -1: counterclockwise
  , speed: 1 // Rounds per second
  , trail: 68 // Afterglow percentage
  , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
  , zIndex: 2e9 // The z-index (defaults to 2000000000)
  , className: 'spinner' // The CSS class to assign to the spinner
  , top: '25%' // Top position relative to parent
  , left: '50%' // Left position relative to parent
  , shadow: true // Whether to render a shadow
  , hwaccel: false // Whether to use hardware acceleration
  , position: 'absolute' // Element positioning
  }

  iCtrl.spinner = new Spinner(opts).spin()
  document.getElementById('panorama').appendChild(iCtrl.spinner.el)


  iCtrl.title = "Incident Controller"
  iCtrl.titles = ['Incident Type', 'Incident Date', 'Incident Address',
                  'Offender Name', 'Offender Age', 'Offender Gender',
                  'Offender Race', 'Officer Name', 'Officer Age', 'Officer Gender', 'Officer Race'];
  iCtrl.pgNum = 1;
  iCtrl.pgSize = 10;

  iCtrl.number = 110;
  iCtrl.getNumber = function(num) {
    var newArray = [];
    for (var i = 0; i < num; i++) {
      newArray.push(i);
    }
    return newArray;
  }





    iCtrl.getRows = function (index) {
      if ((index < iCtrl.pgNum * iCtrl.pgSize) && (index > (iCtrl.pgNum -1) * iCtrl.pgSize)) {
        return true
      } else {
        return false
      }
    }

    iCtrl.changePg = function (page) {
      iCtrl.pgNum = page
      // console.log(iCtrl.pgNum)
    }



    iCtrl.sortType     = 'incident_date'; // set the default sort type
    iCtrl.sortReverse  = false;  // set the default sort order
    iCtrl.changeSort = function(title) {

      var newSortType;
      if (title == "Incident Type") {
        newsortType  = 'incident_type';
      } else if (title == "Incident Date") {
        newsortType  = 'incident_date';
      } else if (title == "Incident Address") {
        newsortType = 'incident_address';
      } else if (title == "Offender Name") {
        newsortType  = 'offender_name';
      } else if (title == "Offender Age") {
        newsortType  = 'offender_age';
      } else if (title == "Offender Gender") {
        newsortType  = 'offender_gender';
      } else if (title == "Offender Race") {
        newsortType  = 'offender_race';
      } else if (title == "Officer Name") {
        newsortType  = 'officer_name';
      } else if (title == "Officer Age") {
        newsortType  = 'officer_age';
      } else if (title == "Officer Gender") {
        newsortType  = 'officer_gender';
      } else if (title == "Officer Race") {
        newsortType  = 'officer_race';
      }

      if(iCtrl.sortType == newsortType) {
        iCtrl.sortReverse = !iCtrl.sortReverse;
      } else {
        iCtrl.sortType = newsortType;
      }
    }




}

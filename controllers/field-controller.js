angular.module('enforcementApp')
  .controller('fieldCtrl', ['DataFactory','$http', fieldController])


function fieldController(DataFactory, $http) {
  console.log('in field')
  var fCtrl = this;

  fCtrl.todaysDate = new Date();

  fCtrl.hvtImages = ['images/mug1.jpg','images/mug2.jpg','images/mug3.jpg','images/mug4.jpg']
  fCtrl.mostWantedData = [];
  fCtrl.mostWanted = [];

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
  , top: '50%' // Top position relative to parent
  , left: '50%' // Left position relative to parent
  , shadow: true // Whether to render a shadow
  , hwaccel: false // Whether to use hardware acceleration
  , position: 'absolute' // Element positioning
  }

  fCtrl.spinner = new Spinner(opts).spin()
  document.getElementById('recon-map').appendChild(fCtrl.spinner.el)

  fCtrl.title = 'Field';
  fCtrl.showFoundIncidents = false;
  fCtrl.showMissingAlert = false;

  fCtrl.number = 110;
  fCtrl.getNumber = function(num) {
    var newArray = [];
    for (var i = 0; i < num; i++) {
      newArray.push(i);
    }
    return newArray;
  }

  $http.get('../MOST_WANTED_MOCK_DATA.json')
    .then(function(data) {
      fCtrl.mostWantedData = data.data;
      // console.log(fCtrl.mostWantedData);
      for (person in fCtrl.mostWantedData) {
        // console.log(person)
        var newPerson = {
          first_name: fCtrl.mostWantedData[person].first_name,
          last_name: fCtrl.mostWantedData[person].last_name,
          gender: fCtrl.mostWantedData[person].gender,
          height: fCtrl.mostWantedData[person].height,
          weight: fCtrl.mostWantedData[person].weight,
          race: fCtrl.mostWantedData[person].race,
          last_seen: fCtrl.mostWantedData[person].last_seen
        }
        fCtrl.mostWanted.push(newPerson);
      }
      // console.log(fCtrl.mostWanted);
      for (var i = 0; i < fCtrl.hvtImages.length; i++) {
        fCtrl.mostWanted[i].image = fCtrl.hvtImages[i];
      }
      // console.log(fCtrl.mostWanted);

    })



  DataFactory.get().then(function(d) {
    fCtrl.data = d.data;

    fCtrl.reconArea = function () {
      GMaps.geolocate({
        success: function(position) {
          fCtrl.position = position;
          fCtrl.getMap(position);
          fCtrl.geocodeIncidents(fCtrl.data, position)
          fCtrl.map.setCenter(position.coords.latitude, position.coords.longitude);
        },
        error: function(error) {
          alert('Geolocation failed: '+error.message);
        },
        not_supported: function() {
          alert("Your browser does not support geolocation");
        },
        always: function() {
        }
      });
    }

    fCtrl.getMap = function (position) {
      fCtrl.map = new GMaps({
        div: '#recon-map',
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zoom: 13
      }
    );

    fCtrl.map.addMarker({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      icon: 'images/badge.png',
      infoWindow: {
        content: '<center>Current Location <br/><b>' + position.coords.latitude + '<br/>' + position.coords.longitude + '</b></center>'
      },
      click: function(e) {
      }
    });

    fCtrl.geocodeIncidents = function(data, position) {
      for (incident of data) {
        // console.log(incident)
        (function(innerIncident){
        GMaps.geocode({
          address: innerIncident.street_address,
          callback: function(results, status) {
            if (status == 'OK') {
              var latlng = results[0].geometry.location;

              fCtrl.map.getRoutes({
                origin: [position.coords.latitude,position.coords.longitude],
                destination: [latlng.lat(), latlng.lng()],
                travelMode: 'driving',
                callback: function (e) {
                    var time = 0;
                    var distance = 0;
                    for (var i=0; i<e[0].legs.length; i++) {
                        time += e[0].legs[i].duration.value;
                        distance += e[0].legs[i].distance.value;
                    }
                    if (distance < 8046.72) {
                      if(innerIncident.incident_type === 'Battery') {
                        iconImg = 'images/battery.png';
                      } else if (innerIncident.incident_type === 'Murder') {
                        iconImg = 'images/murder.png';
                      } else if (innerIncident.incident_type === 'Narcotics') {
                        iconImg = 'images/narcotics.png';
                      } else if (innerIncident.incident_type === 'Criminal Damage') {
                        iconImg = 'images/criminaldamage.png';
                      } else if (innerIncident.incident_type === 'Theft') {
                        iconImg = 'images/theft.png';
                      }

                      fCtrl.map.addMarker({
                        lat: latlng.lat(),
                        lng: latlng.lng(),
                        icon: iconImg,
                        infoWindow: {
                          content: innerIncident.incident_type + " " + innerIncident.incident_date
                        },
                        click: function(e) {
                        }
                      });
                    }
                    console.log(time + " " + distance);
                }
              })

              }
            }
          });
          })(incident);
        }
      }

      }

      fCtrl.findIncidents = function () {
        console.log(fCtrl.fieldOffenderName, fCtrl.fieldIncidentAddress)
        fCtrl.foundIncidents = [];
        for (incident of fCtrl.data) {
          if ((fCtrl.fieldOffenderName == undefined) && (fCtrl.fieldIncidentAddress == undefined)) {
            fCtrl.showMissingAlert = true;
          }
          if(fCtrl.fieldOffenderName != undefined) {
            if (incident.offender_name.toLowerCase() == fCtrl.fieldOffenderName.toLowerCase()) {
              fCtrl.foundIncidents.push(incident);
              fCtrl.showFoundIncidents = true;
            }
          }
          if(fCtrl.fieldIncidentAddress != undefined) {
            if (incident.street_address.toLowerCase() == fCtrl.fieldIncidentAddress.toLowerCase()) {
              fCtrl.foundIncidents.push(incident);
              fCtrl.showFoundIncidents = true;
            }
          }
        }
      }





  })



}

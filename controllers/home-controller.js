angular.module('enforcementApp')
  .controller('homeCtrl', ['DataFactory', homeController])

function homeController(DataFactory) {
  console.log("in home ctrl")
  var hCtrl = this;
  hCtrl.title = "Home Controller";

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
  , top: '60%' // Top position relative to parent
  , left: '50%' // Left position relative to parent
  , shadow: true // Whether to render a shadow
  , hwaccel: false // Whether to use hardware acceleration
  , position: 'absolute' // Element positioning
  }
  hCtrl.spinner = new Spinner(opts).spin()
  document.getElementById('map').appendChild(hCtrl.spinner.el)

  hCtrl.data = [];

  DataFactory.get().then(function(d) {
      hCtrl.data = d.data;

      // console.log(hCtrl.data);

      var first = new Date(hCtrl.data[0].incident_date)

      hCtrl.incidentsThisWeek = getIncidentsThisWeek();
      hCtrl.numIncidentsThisWeek = hCtrl.incidentsThisWeek.length;

      hCtrl.incidentsThisMonth = getIncidentsThisMonth();
      hCtrl.numIncidentsThisMonth = hCtrl.incidentsThisMonth.length;

      hCtrl.numArrestsThisWeek = getArrestsThisWeek(hCtrl.incidentsThisWeek);
      // console.log(hCtrl.numArrestsThisWeek)

      hCtrl.numArrestsThisMonth = getArrestsThisMonth(hCtrl.incidentsThisMonth);
      // console.log(hCtrl.numArrestsThisMonth)

      hCtrl.mostDangerousTOD = getMostDangerousTOD(hCtrl.data);

      function getIncidentsThisWeek() {
        var todaysDate = new Date().getTime();
        var incidents = [];
        // console.log(todaysDate);
        for (incident of hCtrl.data) {
          var incidentDate = new Date(incident.incident_date).getTime();
          // console.log(todaysDate - incidentDate)
          if (incidentDate > (todaysDate - 604800000)) {
            // console.log("found one");
            incidents.push(incident);
          }
        }
        return incidents
      }

      function getArrestsThisWeek(incidents) {
        var numArrests = 0;
        for(incident of incidents) {
          if (incident.arrest_made === true) {
            numArrests++;
          }
        }
        return numArrests;
      }

      function getIncidentsThisMonth() {
        var todaysDate = new Date().getTime();
        var incidents = [];
        // console.log(todaysDate);
        for (incident of hCtrl.data) {
          var incidentDate = new Date(incident.incident_date).getTime();
          // console.log(todaysDate - incidentDate)
          if (incidentDate > (todaysDate - 2592000000)) {
            // console.log("found one");
            incidents.push(incident);
          }
        }
        return incidents
      }

      function getArrestsThisMonth(incidents) {
        var numArrests = 0;
        for(incident of incidents) {
          if (incident.arrest_made === true) {
            numArrests++;
          }
        }
        return numArrests;
      }

      function getMostDangerousTOD(data) {
        var timesOfDay = [
          {
            name: '12am-6am',
            count: 0
          },
          {
            name: '6am-12pm',
            count: 0
          },
          {
            name: '12pm-6pm',
            count: 0
          },
          {
            name: '6pm-12am',
            count: 0
          }
        ];

        for (incident of data) {
          // console.log(incident.incident_time.split(':')[0]);
          var time = incident.incident_time.split(':')[0];
          if (time >= 0 && time <= 5) {
            timesOfDay[0].count++
          } else if (time >= 6 && time <= 11) {
            timesOfDay[1].count++
          } else if (time >= 12 && time <= 17) {
            timesOfDay[2].count++
          } else if (time >= 18 && time <= 23) {
            timesOfDay[3].count++
          }
        }
        // console.log(timesOfDay[1])

        var highest = {
          name: '',
          count: 0
        }


        for (time of timesOfDay) {
          if (time.count > highest.count) {
            highest.name = time.name;
            highest.count = time.count
          }
        }
        return highest.name
      }


      // console.log(hCtrl.data.incident_date);
      // console.log(hCtrl.data.incident_date.split('/')[2], hCtrl.data.incident_date.split('/')[1])
      // for (incident of hCtrl.data) {
      //   console.log(incident.incident_date.split('/')[2], incident.incident_date.split('/')[1]);
      // }

      ///// CHARTIST BUILD //////

      var labelArr = [];
      for (var i = 0; i < 31; i++) {
        (i < 10) ? labelArr.push('0' + i) : labelArr.push(i)
        // console.log(labelArr);
      }
      // console.log(labelArr);
      var incidentsArr = [];
      var arrestsArr = [];
      for (var i = 0; i < 31; i++) {
        var dateCounter = 0;
        var arrestCounter = 0;
        for (incident of hCtrl.data) {
          if ((incident.incident_date.split('/')[2] == 2016) && (incident.incident_date.split('/')[1] == i)) {
            // console.log('incrementing')
            dateCounter++
          }
          if ((incident.incident_date.split('/')[2] == 2016) && (incident.incident_date.split('/')[1] == i) && (incident.arrest_made == true)) {
            arrestCounter++
          }
        }
        incidentsArr.push(dateCounter);
        arrestsArr.push(arrestCounter);
      }
      // console.log(labelArr.slice(1, labelArr.length));

      var data = {
        // A labels array that can contain any sort of values
        labels: labelArr.slice(1, labelArr.length),
        // Our series array that contains series objects or in this case series data arrays
        series: [incidentsArr.slice(1, incidentsArr.length), arrestsArr.slice(1, arrestsArr.length)]
      };

      // We are setting a few options for our chart and override the defaults
      var options = {
        // Don't draw the line chart points
        showPoint: false,
        showArea: true,
        fullWidth: true,
        height: 250,
        axisY: {
          onlyInteger: true
        }
      };




      // Create a new line chart object where as first parameter we pass in a selector
      // that is resolving to our chart container element. The Second parameter
      // is the actual data object.
      hCtrl.monthCart = new Chartist.Line('.ct-chart', data, options);

      // // Let's put a sequence number aside so we can use it in the event callbacks
      // var seq = 0,
      //   delays = 10,
      //   durations = 50;
      //
      // // Once the chart is fully created we reset the sequence
      // hCtrl.monthCart.on('created', function() {
      //   seq = 0;
      // });
      //
      // // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
      // hCtrl.monthCart.on('draw', function(data) {
      //   seq++;
      //
      //   if(data.type === 'line') {
      //     // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
      //     data.element.animate({
      //       opacity: {
      //         // The delay when we like to start the animation
      //         begin: seq * delays + 1000,
      //         // Duration of the animation
      //         dur: durations,
      //         // The value where the animation should start
      //         from: 0,
      //         // The value where it should end
      //         to: 1
      //       }
      //     });
      //   } else if(data.type === 'label' && data.axis === 'x') {
      //     data.element.animate({
      //       y: {
      //         begin: seq * delays,
      //         dur: durations,
      //         from: data.y + 100,
      //         to: data.y,
      //         // We can specify an easing function from Chartist.Svg.Easing
      //         easing: 'easeOutQuart'
      //       }
      //     });
      //   } else if(data.type === 'label' && data.axis === 'y') {
      //     data.element.animate({
      //       x: {
      //         begin: seq * delays,
      //         dur: durations,
      //         from: data.x - 100,
      //         to: data.x,
      //         easing: 'easeOutQuart'
      //       }
      //     });
      //   } else if(data.type === 'point') {
      //     data.element.animate({
      //       x1: {
      //         begin: seq * delays,
      //         dur: durations,
      //         from: data.x - 10,
      //         to: data.x,
      //         easing: 'easeOutQuart'
      //       },
      //       x2: {
      //         begin: seq * delays,
      //         dur: durations,
      //         from: data.x - 10,
      //         to: data.x,
      //         easing: 'easeOutQuart'
      //       },
      //       opacity: {
      //         begin: seq * delays,
      //         dur: durations,
      //         from: 0,
      //         to: 1,
      //         easing: 'easeOutQuart'
      //       }
      //     });
      //   } else if(data.type === 'grid') {
      //     // Using data.axis we get x or y which we can use to construct our animation definition objects
      //     var pos1Animation = {
      //       begin: seq * delays,
      //       dur: durations,
      //       from: data[data.axis.units.pos + '1'] - 30,
      //       to: data[data.axis.units.pos + '1'],
      //       easing: 'easeOutQuart'
      //     };
      //
      //     var pos2Animation = {
      //       begin: seq * delays,
      //       dur: durations,
      //       from: data[data.axis.units.pos + '2'] - 100,
      //       to: data[data.axis.units.pos + '2'],
      //       easing: 'easeOutQuart'
      //     };
      //
      //     var animations = {};
      //     animations[data.axis.units.pos + '1'] = pos1Animation;
      //     animations[data.axis.units.pos + '2'] = pos2Animation;
      //     animations['opacity'] = {
      //       begin: seq * delays,
      //       dur: durations,
      //       from: 0,
      //       to: 1,
      //       easing: 'easeOutQuart'
      //     };
      //
      //     data.element.animate(animations);
      //   }
      // });
      //
      // // For the sake of the example we update the chart every time it's created with a delay of 10 seconds
      // hCtrl.monthCart.on('created', function() {
      //   if(window.__exampleAnimateTimeout) {
      //     clearTimeout(window.__exampleAnimateTimeout);
      //     window.__exampleAnimateTimeout = null;
      //   }
      //   window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 12000);
      // });


      ////// MAP INITIALIZATION //////


      hCtrl.getMap = function(position) {
        hCtrl.map = new GMaps({
          div: '#map',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 13
        });

        hCtrl.spinner.stop()

        hCtrl.map.addMarker({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          icon: 'images/badge.png',
          infoWindow: {
            content: 'Current Location'
          },
          click: function(e) {
          }
        });

        // var counter = 0;
        for (incident of getIncidentsThisMonth()) {
          // counter++
          // console.log(counter, incident.street_address);

          (function(innerIncident){
          // console.log(incident.incident_type)
          GMaps.geocode({
            address: innerIncident.street_address,
            callback: function(results, status) {
              if (status == 'OK') {
                // console.log(results)
                var latlng = results[0].geometry.location;
                var iconImg = '';

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

                // console.log("adding marker...", innerIncident.incident_type)
                hCtrl.map.addMarker({
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
              }
            });
          })(incident);
        }

      }

      GMaps.geolocate({
        success: function(position) {
          hCtrl.position = position;
          hCtrl.getMap(position);
          hCtrl.map.setCenter(position.coords.latitude, position.coords.longitude);
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



  })


}

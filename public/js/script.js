  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
      L.mapbox.accessToken = 'pk.eyJ1IjoiaG1pbGxpc29uIiwiYSI6ImlTV0J6MlEifQ.ucAZL19112n4FI3osinfRw';
  var map = L.mapbox.map('map', 'hmillison.jm4ka3fj', {
      zoomControl: false
    });


  var pos;


  
$(document).on("mouseover", ".row", function(e) {
  var id = $(this).attr("id");
  $(".point"+id).css("stroke",'#C0392B');
  var longlang = $(".point"+id).attr("id").split(",");
  map.panTo([longlang[0],longlang[1]],{
      animate:true,
      duration:1
    })
  });

$(document).on("mouseout", ".row", function(e) {
  var id = $(this).attr("id");
  $(".point"+id).css("stroke",'#3366FF');

});


  function initialize() {

    var markers = [];
    directionsDisplay = new google.maps.DirectionsRenderer();
    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
      zoom: 7,
      center: new google.maps.LatLng(41.850033, -87.6500523)
    };
    //map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    //directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    var control = document.getElementById('control');
    //control.style.display = 'block';
    //map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

    // Create the search box and link it to the UI element.
    var input1 = /** @type {HTMLInputElement} */ (
      document.getElementById('start'));
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input1);

    var searchBox1 = new google.maps.places.SearchBox(
      /** @type {HTMLInputElement} */
      (input1));

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox1, 'places_changed', function() {
      var places = searchBox1.getPlaces();

      for (var i = 0, marker; marker = markers[i]; i++) {
        marker.setMap(null);
      }

      // For each place, get the icon, place name, and location.
      markers = [];
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0, place; place = places[i]; i++) {
        var image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        var marker = new google.maps.Marker({
          map: map,
          icon: image,
          title: place.name,
          position: place.geometry.location
        });

        markers.push(marker);

        bounds.extend(place.geometry.location);
      }

      map.fitBounds(bounds);
    });

    var input2 = /** @type {HTMLInputElement} */ (
      document.getElementById('end'));
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input2);

    var searchBox2 = new google.maps.places.SearchBox(
      /** @type {HTMLInputElement} */
      (input2));

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox2, 'places_changed', function() {
      var places = searchBox2.getPlaces();

      if (places.length == 0) {
        return;
      }
      for (var i = 0, marker; marker = markers[i]; i++) {
        marker.setMap(null);
      }

      // For each place, get the icon, place name, and location.
      markers = [];
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0, place; place = places[i]; i++) {
        var image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        var marker = new google.maps.Marker({
          map: map,
          icon: image,
          title: place.name,
          position: place.geometry.location
        });

        markers.push(marker);

        bounds.extend(place.geometry.location);
      }

      map.fitBounds(bounds);
    });

    directionsDisplay = new google.maps.DirectionsRenderer();
    // var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    // var mapOptions = {
    //   zoom:7,
    //   center: new google.maps.LatLng(41.850033, -87.6500523)
    // };
    // //map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    // //directionsDisplay.setMap(map);
    // directionsDisplay.setPanel(document.getElementById('directions-panel'));

    //var control = document.getElementById('control');
    //map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
  }

  $('#location-form').submit(function(e) {
    e.preventDefault();
    if ($('#start').val().length > 0 && $('#end').val().length > 0) {
      $(".splash").fadeOut("1200", function() {
        calcRoute();
      });
    } else {
      $('#start').addClass('error');
      $('#end').addClass('error');
    }
  });

  function calcRoute() {
    $("#directions-panel").fadeIn();
    var start = $('#start').val();
    var end = $('#end').val();
    var transitrequest = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.TRANSIT
    }
      directionsService.route(transitrequest, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            // var response.routes[0].legs[0] = response.routes[0].legs[0];
            var steps = response.routes[0].legs[0].steps;
            $(".directions-list").append("<h4>" + response.routes[0].legs[0].start_address + "<br/> to <br/>" + response.routes[0].legs[0].end_address + "</h4>" + response.routes[0].legs[0].distance.text + " - " + response.routes[0].legs[0].duration.text);

            for (var i = 0; i < (response.routes[0].legs[0].steps.length); i++) {
              console.log("Iteration num# " + i);
              console.log(response.routes[0].legs[0].steps[i].start_location);

              var bike_start = response.routes[0].legs[0].steps[i].start_location;
              var bike_end = response.routes[0].legs[0].steps[i].end_location;
              var bikeRequest = create_request(bike_start, bike_end, google.maps.TravelMode.BICYCLING);

              var dObject = new $.Deferred();
              deferreds.push(dObject);
              GetBike(bikeRequest, response, dObject);
            }
            $.when.apply($, deferreds).done(function() {
              console.log(bikeResults);
              compareSteps(response, bikeResults);
            });
          }


        });


  }

  function create_request(or, dest, tra_mod){
  return {
    origin:or,
    destination:dest,
    travelMode: tra_mod
  };
}
var deferreds = []
var bikeResults = [];





  function compareSteps(transitResponse, bikeResults) {

    console.log("Comparing Routes");
    console.log(transitResponse.routes[0].legs[0]);
    console.log("Bike Results");
    console.log(bikeResults);

    for (var w = 0; w < (transitResponse.routes[0].legs[0].steps.length); w++) {

         console.log("Transit Loop" + w);


      for(var y = 0 ; y<bikeResults.length; y++){

        console.log("Bike Loop" + y );


        if(transitResponse.routes[0].legs[0].steps[w].start_location === bikeResults[y].routes[0].legs[0].start_location){
            console.log("Same Start Location");
          if(transitResponse.routes[0].legs[0].steps[w].duration.value > bikeResults[y].routes[0].legs[0].duration.value){


                console.log("Bike is Fastest");
                transitResponse.routes[0].legs[0].steps.splice(w, 1, bikeResults[y].routes[0].legs[0].steps[0]);

                //console.log(bikeResults[y].routes[0].legs[0]);

                 //console.log( transitResponse.routes[0].legs[0]);
                  for(var u= 1 ; y<bikeResults[y].routes[0].legs[0].steps.length; u++){
                      console.log("Going trough the loop");
                      transitResponse.routes[0].legs[0].steps.splice(w+u,0,bikeResults[w].routes[0].legs[0].steps[u]);

                    }


                }   

        }



      }

      

    }



    $.ajax({
      type: "POST",
      url: '/createGeoJSON',
      data: {
        'directions': JSON.stringify(transitResponse.routes[0].legs[0].steps)
      },
      dataType: 'json',
      success: function(data) {
        drawRoute(data, transitResponse);
      },
      error: function(data){
        $("#directions-panel").text("");
        $("#directions-panel").fadeOut();
        $(".splash").fadeIn();
      }
    });
    var steps = transitResponse.routes[0].legs[0].steps;
    for (var i = 0; i < steps.length; i++) {
      $(".directions-list").append("<div class='row' id='"+ i +"'><span class='lead'>" + steps[i].instructions + "</span><br />" + steps[i].duration.text + "</div>")
    }

  }

  function GetBike(bikeRequest, response, dObject) {
    directionsService.route(bikeRequest, (function(response) {

      return function(responseBike, status) {
        console.log("Bike Leg: ")
        console.log(responseBike);

        if (status == google.maps.DirectionsStatus.OK) {
          dObject.resolve();
          bikeResults.push(responseBike);

        }
      }



    })(response));
  }

  function drawRoute(data, maps) {
    console.log(maps);

    map.setView([data.features[0].geometry.coordinates[0][1], data.features[0].geometry.coordinates[0][0]], 14);
    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
      g = svg.append("g").attr("class", "leaflet-zoom-hide");
    var transform = d3.geo.transform({
        point: projectPoint
      }),
      d3path = d3.geo.path().projection(transform);
    var feature = g.selectAll("path")
      .data(data.features)
      .enter().append("path")
      .attr("class", function(d) {
        console.log(d);
        return "point" + d.properties.key;
      })
      .attr("id", function(d){
        return d.geometry.coordinates[0][1] + "," + d.geometry.coordinates[0][0];
      })
      .attr("style", "fill: none;stroke-width: 4px;stroke:#3366FF;");
    var steps = maps.routes[0].legs[0].steps;



    map.on("viewreset", reset);
    reset();



    // Reposition the SVG to cover the features.
    function reset() {
      var bounds = d3path.bounds(data);
      topLeft = bounds[0],
      bottomRight = bounds[1];

      svg.attr("width", bottomRight[0] - topLeft[0] + 100)
        .attr("height", bottomRight[1] - topLeft[1] + 100)
        .style("left", topLeft[0] - 50 + "px")
        .style("top", topLeft[1] - 50 + "px");

      g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

      feature.attr("d", d3path);

      //TODO: Figure out why this doesn't work as points.attr...
      g.selectAll(".point")
        .attr("transform", function(d) {
          return translatePoint(d);
        });
    }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }

    function translatePoint(d) {
      console.log(d);
      var point = map.latLngToLayerPoint(new L.LatLng(d[1], d[0]));

      return "translate(" + point.x + "," + point.y + ")";
    }

    function coordToLatLon(coord) {
      var point = map.layerPointToLatLng(new L.Point(coord[0], coord[1]));
      return point;
    }


    //     function transition(path) {

    //     g.selectAll

    //     path.transition()
    //     .attrTween("stroke-dasharray", tweenDash)
    //         var nextPath = svg.select("path.trip" + i);
    //         if (nextPath[0][0]==null){
    //             clearTimeout(timer);
    //         } else {
    //             iterate(); 
    //         }



    // }
    function tweenDash() {
      var l = path.node().getTotalLength();
      var i = d3.interpolateString("0," + l, l + "," + l); // interpolation of stroke-dasharray style attr
      return function(t) {
        var marker = d3.select("#marker");
        var p = path.node().getPointAtLength(t * l);
        marker.attr("transform", "translate(" + p.x + "," + p.y + ")"); //move marker
        return i(t);
      }
    }

  }

  google.maps.event.addDomListener(window, 'load', initialize);
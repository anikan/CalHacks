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
  

  function create_request(or, dest, tra_mod){
  return {
    origin:or,
    destination:dest,
    travelMode: tra_mod
  };
}
var deferreds = []; 
var bikeResults = [];

//on submit button execute calcRoute()
$('#location-form').submit(function(e) {
    e.preventDefault();
    if ($('#start').val().length > 0 && $('#end').val().length > 0) {
        $(".splash").fadeOut("1200", function(){
            calcRoute();
        });
    }else{
        $('#start').addClass('error');
        $('#end').addClass('error');
    }
  });
  
//built header of direction list
function built_directions_header(legs){
  $(".directions-list").append(
    "<h4>" + legs.start_address +
      "<br/> to <br/>" + legs.end_address + 
    "</h4>" + 
    legs.distance.text + " - " + 
    legs.duration.text);
}

function calcRoute(){
  $("#directions-panel").fadeIn();
  var start = $('#start').val();
  var end = $('#end').val();
  var transitrequest = create_request(start,end,google.maps.TravelMode.TRANSIT);

  directionsService.route(transitrequest, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        built_directions_header(response.routes[0].legs[0]);

        for (var i = 0; i < (response.routes[0].legs[0].steps.length); i++) {
          var current_step = response.routes[0].legs[0].steps[i];// current step of the iteration
          console.log("Iteration num# " + i);
          console.log(current_step.start_location);

          var bike_start = current_step.start_location;
          var bike_end = current_step.end_location;
          var bikeRequest = create_request(bike_start, bike_end, google.maps.TravelMode.BICYCLING);

          var dObject = new $.Deferred();
          deferreds.push(dObject);
          GetBike(bikeRequest,dObject);
        }
        $.when.apply($, deferreds).done(function() {
          console.log(bikeResults);
          compareSteps(response, bikeResults);
        });
      }
  });
}





function compareSteps(transitResponse, bikeResults) {

  console.log("Comparing Routes");
  console.log(transitResponse.routes[0].legs[0]);
  console.log("Bike Results");
  console.log(bikeResults);

  for (var w = 0; w < (transitResponse.routes[0].legs[0].steps.length); w++) {
    var transit_step = transitResponse.routes[0].legs[0].steps[w];//current w_th transit step
    console.log("Transit Loop" + w);

    for(var y = 0 ; y<bikeResults.length; y++){
      var bike_leg = bikeResults[y].routes[0].legs[0];//current y_th bike leg
      console.log("Bike Loop" + y );
      //console.log("Checking if " + transitResponse.routes[0].legs[0].steps[w].start_location.B + "  " + bikeResults[y].routes[0].legs[0].start_location.B);
      if((transit_step.start_location.B === bike_leg.start_location.B) 
        &&(transit_step.start_location.k === bike_leg.start_location.k)){
        console.log("Same Start Location");
        if(transit_step.duration.value > bike_leg.duration.value){
          console.log("Bike is Fastest");
          //transitResponse.routes[0].legs[0].steps.splice(w, 1, bikeResults[y].routes[0].legs[0].steps[0]);
          transitResponse.routes[0].legs[0].steps.splice(w, 1, bikeResults[y].routes[0].legs[0].steps[0]);

          for(var u= 1 ; u<bikeResults[y].routes[0].legs[0].steps.length; u++){
            var bike_step = bikeResults[w].routes[0].legs[0].steps[u]; //current bike step
            console.log("Going trough the loop");
            transitResponse.routes[0].legs[0].steps.splice(w+u,0,bike_step);

          }//end for bikeResults...legs 
        }//end if transit > bike
      }//end && if
    }//end for bikeResults.length
  }//end for transitResponse 
  
/*after loop transit response has been cobined with bikeResults*/


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
    console.log(steps[i].instructions);
    var instructions = steps[i].instructions.replace('<div style="font-size:0.9em">Destination will be on the right</div>',"");
    var instructions = instructions.replace('<div style="font-size:0.9em">Destination will be on the right</div>',"");
    console.log(instructions);
    var html = "<div class='row' id='"+ i +"'><span class='lead'>" + instructions + "</span><br />" 
      + steps[i].duration.text;
      if(steps[i].travel_mode == "BICYCLING"){
        html += "<br /> <img src='/images/bike.png' style='width:20%'>";
      }
    html += "</div>";
    $(".directions-list").append(html);
  }
}

function GetBike(bikeRequest, dObject) {
  directionsService.route(bikeRequest,function(responseBike, status) {
      //console.log("Bike Leg: ")
      //console.log(responseBike);

      if (status == google.maps.DirectionsStatus.OK) {
        dObject.resolve();
        bikeResults.push(responseBike);

      }//end if
  });//end directionService
}//end GetBike

function drawRoute(data, maps) {
  //console.log(maps);

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

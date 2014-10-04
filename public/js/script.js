  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
  var map;

  var pos;

  function initialize() {


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

  function calcRoute() {
    $(".splash").fadeOut("1200", function() {
       $("#directions-panel").fadeIn();
      var start = document.getElementById('start').value;
      var end = document.getElementById('end').value;
      var transitrequest = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.TRANSIT
      };
      var bikerequest = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.BICYCLING
      };
      directionsService.route(transitrequest, function(response, status) {
        console.log(response);
        var steps = response.routes[0].legs[0].steps;
        $(".directions-list").append("<h4>" + response.routes[0].legs[0].start_address + "<br/> to <br/>" + response.routes[0].legs[0].end_address + "</h4>");
        for(var i = 0;i<steps.length;i++){
          $(".directions-list").append("<div class='row'>" + steps[i].instructions + "</div>")
        }
        if (status == google.maps.DirectionsStatus.OK) {
          var maps = response.routes;
          //directionsDisplay.setDirections(map);

          $.ajax({
            type: "POST",
            url: '/createGeoJSON',
            data: {
              'directions': JSON.stringify(maps)
            },
            dataType: 'json',
            success: function(data) {
              drawRoute(data, maps);


            }
          });
      
        }
      });
    });



    // Reposition the SVG to cover the features.



  }

  function drawRoute(data, maps) {
    // Provide your access token
    console.log(maps);
    L.mapbox.accessToken = 'pk.eyJ1IjoiaG1pbGxpc29uIiwiYSI6ImlTV0J6MlEifQ.ucAZL19112n4FI3osinfRw';
    // Create a map in the div #map
    var map = L.mapbox.map('map', 'hmillison.jm4ka3fj', {
      zoomControl: false
    }).setView([data.features[0].geometry.coordinates[0][1], data.features[0].geometry.coordinates[0][0]], 14);
    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
      g = svg.append("g").attr("class", "leaflet-zoom-hide");
    var transform = d3.geo.transform({
        point: projectPoint
      }),
      d3path = d3.geo.path().projection(transform);
    var feature = g.selectAll("path")
      .data(data.features)
      .enter().append("path")
      .attr("class", function (d){
          return "point"
      })
      .attr("style", "fill: none;stroke-width: 4px;stroke:#3366FF;");
      var steps = maps.routes[0].legs[0].steps;
      for(var i = 0;i<steps.length;i++){
            for(var j = 0;steps[i].lat_lngs;j++){
               map.panTo(steps[i].lat_lngs[])
            }
          });
      }

  
    //map.on("viewreset",reset);
    reset();




    var coords = data.features[0].geometry.coordinates;
 
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

    // $(".point").each(function(d) {
    //   console.log(d);
    //   //add the translation of the map's g element
    //   startPoint[0] = startPoint[0]; //+ topLeft[0];
    //   startPoint[1] = startPoint[1]; //+ topLeft[1];
    //   var newLatLon = coordToLatLon(startPoint);
    //   pointsArray.push([newLatLon.lng, newLatLon.lat, d.properties.hasfare]);
    //   points = g.selectAll(".point").data(pointsArray).enter().append(
    //     'circle').attr("r", 5).attr("class", function(d) {
    //     if (d[2]) {
    //       return "startPoint point";
    //     } else {
    //       return "endPoint point";
    //     }
    //   }).attr("transform", function(d) {
    //     return translatePoint(d);
    //   });
    //   marker.transition().duration(500).attr("r", 5).attr('style',
    //     'opacity:1');

    // });

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }

    function translatePoint(d) {
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
          marker.attr("transform", "translate(" + p.x + "," + p.y + ")");//move marker
          return i(t);
        }
      }

  }
  google.maps.event.addDomListener(window, 'load', initialize);
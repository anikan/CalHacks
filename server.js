express = require('express'),
app = express();
var request = require('request');
var bodyParser = require('body-parser');
polyline = require('polyline'),
app.use(bodyParser());


app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');

var example = __dirname + '/example.json';


var port = process.env.PORT || 3000;    // set our port
require(__dirname + '/routes');

var router = express.Router();


var featureCollection = {
  type:"FeatureCollection",
  features:[]
};

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.post('/createGeoJSON', function(req,res){

	var rawData = JSON.parse(req.body.directions);
	featureCollection.features = [];

  for(var i=0;i<rawData[0].legs[0].steps.length-1;i++) {
    coordinates = rawData[0].legs[0].steps[i].polyline.points;
   coordinates2 = rawData[0].legs[0].steps[i+1].polyline.points;
    coordinates = polyline.decode(coordinates);
   coordinates2 = polyline.decode(coordinates2);

    var feature = {
      type:"Feature",
      properties:{},
      geometry:{
        type:"LineString",
        coordinates:[]
      }
    }

    var feature2 = {
      type:"Feature",
      properties:{},
      geometry:{
        type:"LineString",
        coordinates:[]
      }
    }

    for(var j=0;j<coordinates.length;j++){

	var coord = [coordinates[j][1],coordinates[j][0]]
	//create a feature
	feature.geometry.coordinates.push(coord);
	};

	for(var j=0;j<coordinates2.length;j++){

	  var coord = [coordinates2[j][1],coordinates2[j][0]]
	//create a feature
	feature2.geometry.coordinates.push(coord);
	};


	feature.properties.key = i;
	//feature2.properties.key = i;
	feature.properties.duration = rawData[0].legs[0].steps[i].duration.value

	featureCollection.features.push(feature);
	// featureCollection.features.push(feature2);
	}

	res.send(featureCollection);
});

app.listen(port);
console.log('Listening on port ' + port);

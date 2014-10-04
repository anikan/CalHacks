var i = 0;

function iterate() {

    var chartInterval = 0;

    var emptyData = [];

    var emptyPath = areaChartSvg.append("path")
    .datum(emptyData)
    .attr("class", "empty");



    var path = svg.select("path.trip" + i)
    .attr("style", "opacity:.7")
    .call(transition);



    function pathStartPoint(path) {
        var d = path.attr('d');

        dsplitted = d.split("L")[0].slice(1).split(",");
        var point = []
        point[0]=parseInt(dsplitted[0]);
        point[1]=parseInt(dsplitted[1]);

        return point;
    }


    var startPoint = pathStartPoint(path);
    marker.attr("transform", "translate(" + startPoint[0] + "," + startPoint[1] + ")");


path.each(function(d){

//add the translation of the map's g element
startPoint[0] = startPoint[0]; //+ topLeft[0];
startPoint[1] = startPoint[1]; //+ topLeft[1];
var newLatLon = coordToLatLon(startPoint);
pointsArray.push([newLatLon.lng,newLatLon.lat,d.properties.hasfare]);


points = g.selectAll(".point")
.data(pointsArray)
.enter()
.append('circle')
.attr("r",5)
.attr("class",function(d){
    if(d[2]) {
        return "startPoint point";
    } else {
        return "endPoint point";
    }
})
.attr("transform",function(d){
    return translatePoint(d);  
});

if(d.properties.hasfare) { //transition marker to show full taxi
    marker
    .transition()
    .duration(500)
    .attr("r",5)
    .attr('style','opacity:1');







} else { //Transition marker to show empty taxi

    marker
    .transition()
    .duration(500)
    .attr("r",40)
    .attr('style','opacity:.3');

}
});




function transition(path) {

    g.selectAll

    path.transition()
    .duration(function(d){
        //calculate seconds
        var start = Date.parse(d.properties.pickuptime),
        finish = Date.parse(d.properties.dropofftime),
        duration = finish - start;

        duration = duration/60000; //convert to minutes

        duration = duration * (1/timeFactor) * 1000;


        time = moment(d.properties.pickuptime.toString());



        $('.readableTime').text(time.format('h:mm a'));


        return (duration);
})
    .attrTween("stroke-dasharray", tweenDash)
    .each("end", function (d) {

        if(d.properties.hasfare) {

            running.fare += parseFloat(d.properties.fare);
            running.surcharge += parseFloat(d.properties.surcharge);
            running.mtatax += parseFloat(d.properties.mtatax);
            running.tip += parseFloat(d.properties.tip);
            running.tolls += parseFloat(d.properties.tolls);
            running.total += parseFloat(d.properties.total);
            running.passengers += parseFloat(d.properties.passengers);



            for(var p = 0;p<d.properties.passengers;p++){
                $('.passengerGlyphs').append('<span class="glyphicon glyphicon-user"></span>');
            }

            updateRunning();



        };
        i++;

        var nextPath = svg.select("path.trip" + i);
        if (nextPath[0][0]==null){
            clearTimeout(timer);
        } else {
            iterate(); 
        }


    });

}

function tweenDash(d) {

    var l = path.node().getTotalLength();
var i = d3.interpolateString("0," + l, l + "," + l); // interpolation of stroke-dasharray style attr
return function (t) {
    var marker = d3.select("#marker");
    var p = path.node().getPointAtLength(t * l);
marker.attr("transform", "translate(" + p.x + "," + p.y + ")");//move marker


if (tweenToggle == 0) {
    tweenToggle = 1;
    var newCenter = map.layerPointToLatLng(new L.Point(p.x,p.y));

    map.panTo(newCenter, 14);
} else {
    tweenToggle = 0;
}


//update chart data every X frames
if(chartInterval == 5){

    chartInterval = 0;



    var decimalHour = parseInt(time.format('H')) + parseFloat(time.format('m')/60)




    if(isNaN(d.properties.fare)){
        d.properties.fare = 0; 
    }

    var incrementalFare = d.properties.fare*t;


    dummyData.push({
        "time": decimalHour,
        "runningFare": running.fare + parseFloat(incrementalFare)
    });


chartPath.attr("d", area); //redraw area chart
if(d.properties.hasfare == false) { //draw purple area for nonfare time
    emptyData.push({
        "time": decimalHour,
        "runningFare": running.fare + parseFloat(incrementalFare)
    });

    emptyPath.attr("d", area);
}

markerLine
.attr('x1', x(decimalHour))
.attr('x2', x(decimalHour));




} else {
    chartInterval++;
}


return i(t);
}
}

}
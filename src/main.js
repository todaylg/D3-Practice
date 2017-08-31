import * as d3 from "d3";
import * as topojson from "topojson";

var width = 960,
	height = 960,
	globe = {type: "Sphere"};

var projection = d3.geoOrthographic()
	.translate([width / 2, height / 2])
	.scale(width / 2 - 20)
	.clipAngle(90)
	.precision(0.6);

var canvas = d3.select("body").append("canvas")
	.attr("width", width)
	.attr("height", height);

var c = canvas.node().getContext("2d"),
	path = d3.geoPath(d3.geoOrthographic(), c);

var land,countries,borders,i,n;
d3.json("./dist/world-110m.json", function(error, world) {
  if (error) throw error;
  	land = topojson.feature(world, world.objects.land);
	  countries = topojson.feature(world, world.objects.countries).features;
	  borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });
	  i = -1;
	  n = countries.length;

(function transition() {
	var t = d3.transition()
        .duration(1250)
        .tween("rotate", function() {
          var p = d3.geoCentroid(countries[i]),
              r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
          return function(t) {
            projection.rotate(r(t));
            c.clearRect(0, 0, width, height);
            c.fillStyle = "#ccc", c.beginPath(), path(land), c.fill();
            c.fillStyle = "#f00", c.beginPath(), path(countries[i]), c.fill();
            c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
            c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
          };
        })
      	.transition()
        	

        d3.select("body").transition(t);
  })();
  // console.log(land);
  // console.log(countries);
});

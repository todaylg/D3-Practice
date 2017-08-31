import * as d3 from "d3";
import * as topojson from "topojson";
var width = 960,
    height = 960;
 d3.json("./dist/world-110m.json", function(world) {

	var projection = d3.geoOrthographic().scale(245).translate([width / 2, height / 2]).clipAngle(90);
	var path = d3.geoPath().projection(projection);
	var countries = topojson.feature(world, world.objects.countries).features;
	var color = d3.scaleOrdinal(d3.schemeCategory20);
	console.log(countries);

	var polygon = d3.select("#svg").selectAll("path").data(countries);
	  polygon.enter().append("path").attr("d",path).attr("fill",function(d){return color(d.id);});
	  console.log(path);
	d3.select("#svg").call(d3.drag()
	    .subject(function() {
	      var r = projection.rotate();
	      return {x: r[0], y: -r[1]};
	    })
	    .on("drag", function() {
	   
	    var rotate = projection.rotate();
	    projection.rotate([d3.event.x, -d3.event.y, rotate[2]]);
	    d3.select("#svg").selectAll("path").attr("d", path);
	  }));

});


import * as d3 from "d3";
import * as topojson from "topojson";

//30=>China(Ten) 168=>United States 87=>Korea 82=>Japan
var width,height,projection,path,countries,color,worldInfoTemp,
	arrCountries=[
	{
		first:168,
		last:168
	},
	{
		first:168,
		last:87
	},
	{
		first:168,
		last:168
	},
	{
		first:168,
		last:30
	},
	{
		first:168,
		last:168
	},
	{
		first:168,
		last:30
	},
	{
		first:30,
		last:30
	},
	{
		first:30,
		last:30
	},
	{
		first:82,
		last:168
	},
	{
		first:30,
		last:168
	},
	],
	preloadArr = ['./dist/Adidas.png','./dist/Alibaba.png','./dist/Apple.png','./dist/China.png','./dist/Geely.png','./dist/JD.png','./dist/KFC.png','./dist/Mcdonald.png','./dist/Nike.png','./dist/Samsung.png','./dist/Tencent.png','./dist/Tesla.png','./dist/Toyota.png','./dist/USA.png'];

function Preload(){
	var len = preloadArr.length,preCount=0;
	for(let i=0;i<len;i++){
		let imgTemp = new Image();
		imgTemp.src = preloadArr[i];
		imgTemp.onload = function(){
			preCount++;
			if(preCount >= len){
				//图片预加载完成
				d3.select('.loadingBG').classed('close',true);
				setTimeout(init, 500);
			}
		}
	}
}

function init(){
	fixWH();
	d3.json("./dist/world-110m.json", function(world) {
		worldInfoTemp = world;
		ready(world);
	});
	//Drag();
}

function fixWH(){
	width = window.innerWidth,height = window.innerHeight;
	d3.select("#svgContain").attr("width", width).attr("height", height);
	d3.select("#svg").attr("width", width).attr("height", height);
}

function ready(world){
	projection = d3.geoOrthographic().scale(245).translate([width / 2, height / 1.5]).clipAngle(90);
	path = d3.geoPath().projection(projection);
	countries = topojson.feature(world, world.objects.countries).features;
	color = d3.scaleOrdinal(d3.schemeCategory20);
	console.log(countries);

	var polygon = d3.select("#svg").selectAll("path").data(countries);
	polygon.enter().append("path").attr("d",path).attr("fill",function(d){return color(d.id);});
	taskQueue();
}

function taskQueue(){
	new Promise((resolve, reject) => {
		Animation1();
		tansitionBegin(0,resolve)
	})
	.then((resolve)=>{
		console.log(1)
		Animation2();
		return new Promise((resolve, reject) => {
			tansitionBegin(1,resolve)
		})
	})
	.then((resolve, reject)=>{
		console.log(2)
		return new Promise((resolve, reject) => {
			tansitionBegin(2,resolve)
		})
	})
	.then((resolve, reject)=>{
		console.log(3)
		return new Promise((resolve, reject) => {
			tansitionBegin(3,resolve)
		})
	})
	.then((resolve, reject)=>{
		console.log(4)
		return new Promise((resolve, reject) => {
			tansitionBegin(4,resolve)
		})
	})
	.then((resolve, reject)=>{
		console.log(5)
		return new Promise((resolve, reject) => {
			tansitionBegin(5,resolve)
		})
	})
	.then((resolve, reject)=>{
		console.log(6)
		return new Promise((resolve, reject) => {
			tansitionBegin(6,resolve)
		})
	})
}

function Drag(){
	d3.select("#svg").call(
		d3.drag()
		.subject(function() {
			var r = projection.rotate();
			return {x: r[0], y: -r[1]};
		})
		.on("drag", function() {
			var rotate = projection.rotate();
			projection.rotate([d3.event.x, -d3.event.y, rotate[2]]);
			d3.select("#svg").selectAll("path").attr("d", path);
		})
	);
}

function tansitionBegin(i,resolve){
	if(i<arrCountries.length){
		var selectId = "#entry"+i;
		d3.select(selectId).classed('active',true);
		d3.transition()
	    .duration(1250)
	    .tween("rotate", function() {
			var p = d3.geoCentroid(countries[arrCountries[i].first]),
				r = d3.geoInterpolate(projection.rotate(), [-p[0], -p[1]]);
			console.log("p:"+p);
			console.log("r:"+r);
			return function(t) {
				projection.rotate(r(t));
				d3.select("#svg").selectAll("path").attr("d", path);
			};
		})
		.on('end',()=>{
			d3.transition()
		    .duration(1250)
		    .tween("rotate", function() {
				var p = d3.geoCentroid(countries[arrCountries[i].last]),
					r = d3.geoInterpolate(projection.rotate(), [-p[0], -p[1]]);
				console.log("p:"+p);
				console.log("r:"+r);
				return function(t) {
					projection.rotate(r(t));
					d3.select("#svg").selectAll("path").attr("d", path);
				};
			})
			.on('end',()=>{
				var t = d3.transition()
					    .duration(750)
					    .ease(d3.easeLinear);
			    d3.select("#leftLogo").transition(t)
			        .style("opacity", "0").style("transform", "translateX(-2%)");
			    d3.select("#rightLogo").transition(t)
			        .style("opacity", "0").style("transform", "translateX(2%)");
				setTimeout(()=>{
					d3.select(selectId).classed('active',false);
					resolve();
				}, 2000)
				
			})
		})
	}
}

var left = d3.select("#leftLogo");
var leftImg = d3.select("#leftLogo img");
var right = d3.select("#rightLogo");
var rightImg = d3.select("#rightLogo img")
function Animation1(){
	leftImg.attr("src", preloadArr[8]);
	rightImg.attr("src", preloadArr[13]);
	var t = d3.transition()
	    .duration(750)
	    .ease(d3.easeLinear);

	left.transition(t)
	    .style("opacity", "1").style("transform", "translateX(0)");

	right.transition(t)
	    .style("opacity", "1").style("transform", "translateX(0)");
}
function Animation2(){
	leftImg.attr("src", preloadArr[2]);
	rightImg.attr("src", preloadArr[9]);

	var t = d3.transition()
	    .duration(750)
	    .ease(d3.easeLinear);

	left.transition(t)
	    .style("opacity", "1").style("transform", "translateX(0)");

	right.transition(t)
	    .style("opacity", "1").style("transform", "translateX(0)");
}
Preload();
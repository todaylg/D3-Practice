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
		first:87,
		last:87
	},
	{
		first:168,
		last:168
	},
	{
		first:30,
		last:30
	},
	{
		first:168,
		last:168
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
	preloadArr = ['./dist/Adidas.png','./dist/Alibaba.png','./dist/Apple.png','./dist/China.png','./dist/Geely.png','./dist/JD.png','./dist/KFC.png','./dist/Mcdonald.png','./dist/Nike.png','./dist/Samsung.png','./dist/Tencent.png','./dist/Tesla.png','./dist/Toyota.png','./dist/USA.png','./dist/Z_Decrease.png','./dist/Z_Increase.png','./dist/Z_Handshake.png','./dist/Z_VS.png'];

function preload(){
	var len = preloadArr.length,preCount=0;
	for(let i=0;i<len;i++){
		let imgTemp = new Image();
		imgTemp.src = preloadArr[i];
		imgTemp.onload = function(){
			preCount++;
			if(preCount >= len){
				//图片预加载完成
				d3.select('.loadingBG').classed('close',true);
				setTimeout(()=>{
					d3.select('.loadingBG').remove();
					init();
				}, 500);
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
	taskListenr();
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

	var polygon = d3.select("#svg").selectAll("path").data(countries);
	polygon.enter().append("path").attr("d",path).attr("fill",function(d){return color(d.id);});
	taskQueue();
}
function promiseGenerate(i){
	return new Promise((resolve, reject) => {
		tansitionBegin(i,resolve)
	})
}
function taskQueue(){
	new Promise((resolve, reject) => {
		basicAnimation(8,13);
		tansitionBegin(0,resolve)
	})
	.then((resolve)=>{
		middleAnimation(2,9,17)
		return promiseGenerate(1);
	})
	.then((resolve, reject)=>{
		middleAnimation(0,8,17);
		return promiseGenerate(2);
	})
	.then((resolve, reject)=>{
		middleAnimation(1,3,14);//decrease
		return promiseGenerate(3);
	})
	.then((resolve, reject)=>{
		middleAnimation(7,13,15);//increase
		return promiseGenerate(4);
	})
	.then((resolve, reject)=>{
		middleAnimation(6,3,14);//decrease
		return promiseGenerate(5);
	})
	.then((resolve, reject)=>{
		middleAnimation(1,3,15);//increase
		return promiseGenerate(6);
	})
	.then((resolve, reject)=>{
		middleAnimation(10,5,15);//increase
		return promiseGenerate(7);
	})
	.then((resolve, reject)=>{
		middleAnimation(12,11,16);
		return promiseGenerate(8);
	})
	.then((resolve, reject)=>{
		basicAnimation(4,11);
		return promiseGenerate(9);
	})
}

function taskListenr(){
	d3.select(".entries").on("click", function(e) {
		var target = d3.event.target;
		var className = d3.event.target.className;
		var id;
		if(className ==='label'){
			id = target.parentNode.id;
		}else if(className ==='detail'||className ==='time'){
			id = target.parentNode.parentNode.id;
		}
		if(id){
			id=id.charAt(id.length-1);
			animationTriggle(id);
		}
	});
}
//事件委托
function animationTriggle(index){
	switch (index) {
		case '0':
			basicAnimation(8,13);
			tansitionBegin(0);
			break;
		case '1':
			middleAnimation(2,9,17)
			tansitionBegin(1);
			break;
		case '2':
			middleAnimation(0,8,17);
			tansitionBegin(2);
			break;
		case '3':
			middleAnimation(1,3,14);//decrease
			tansitionBegin(3);
			break;
		case '4':
			middleAnimation(7,13,15);//increase
			tansitionBegin(4);
			break;
		case '5':
			middleAnimation(6,3,14);//decrease
			tansitionBegin(5);
			break;
		case '6':
			middleAnimation(1,3,15);//increase
			tansitionBegin(6);
			break;
		case '7':
			middleAnimation(10,5,15);//increase
			tansitionBegin(7);
			break;
		case '8':
			middleAnimation(12,11,16);
			tansitionBegin(8);
			break;
		case '9':
			basicAnimation(4,11);
			tansitionBegin(9);
			break;
	}
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

function reset(){
	var t = d3.transition()
		    .duration(750)
		    .ease(d3.easeLinear);
	d3.select("#leftLogo").transition(t)
	    .style("opacity", "0").style("transform", "translateX(-2%)");
	d3.select("#rightLogo").transition(t)
	    .style("opacity", "0").style("transform", "translateX(2%)");
	d3.select("#midLogo").transition(t)
	    .style("opacity", "0").style("transform", "translateY(-3%)");
}

function tansitionBegin(i,resolve){
	if(i<arrCountries.length){
		var selectId = "#entry"+i;
		d3.select(selectId).classed('active',true);
		d3.transition()
	    .duration(1500)
	    .tween("rotate", function() {
			var p = d3.geoCentroid(countries[arrCountries[i].first]),
				r = d3.geoInterpolate(projection.rotate(), [-p[0], -p[1]]);
			return function(t) {
				projection.rotate(r(t));
				d3.select("#svg").selectAll("path").attr("d", path);
			};
		})
		.on('end',()=>{
			d3.transition()
		    .duration(1500)
		    .tween("rotate", function() {
				var p = d3.geoCentroid(countries[arrCountries[i].last]),
					r = d3.geoInterpolate(projection.rotate(), [-p[0], -p[1]]);
				return function(t) {
					projection.rotate(r(t));
					d3.select("#svg").selectAll("path").attr("d", path);
				};
			})
			.on('end',()=>{
			    reset();
				setTimeout(()=>{
					d3.select(selectId).classed('active',false);
					if(resolve)resolve();
				}, 1000)
			})
		})
	}
}

var left = d3.select("#leftLogo");
var leftImg = d3.select("#leftLogo img");
var mid = d3.select("#midLogo");
var midImg = d3.select("#midLogo img");
var right = d3.select("#rightLogo");
var rightImg = d3.select("#rightLogo img");

function basicAnimation(first,last){
	leftImg.attr("src", preloadArr[first]);
	rightImg.attr("src", preloadArr[last]);
	var t = d3.transition()
	    .duration(750)
	    .ease(d3.easeLinear);

	left.transition(t)
	    .style("opacity", "1").style("transform", "translateX(0)");

	right.transition(t)
	    .style("opacity", "1").style("transform", "translateX(0)");
}

function middleAnimation(first,last,middle){
	basicAnimation(first,last);
	midImg.attr("src", preloadArr[middle]);
	var t = d3.transition()
	    .duration(750)
	    .ease(d3.easeLinear);
	mid.transition(t)
	    .style("opacity", "1").style("transform", "translateY(0)");
}

preload();
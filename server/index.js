"use strict";

var express = require('express');
var path = require('path');
var http = require('http');

var app = express();
var port = process.env.PORT || 8088;

app.set('port',port);
app.use(express.static(path.join(__dirname, '../')));//entry

var server = http.createServer(app);
server.listen(app.get('port'));

server.on('listening', function(){
	console.log('----------listening on port: ' + app.get('port') +'----------------------');
});

var express = require('express');
var routes = express.Router();
var path = require('path');

routes.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname + '/../public/views/startevent.html'));
});

module.exports = routes;
/*
	console.log(req.body.email+" "+req.body.pass);
	*/
var express = require('express');
var routes = express.Router();

routes.post('/', function(req, res) {

	console.log(req.body.email+" "+req.body.pass);
	/*
	SQL_Connection
	*/
	res.send("Hello World!");
});

module.exports = routes;

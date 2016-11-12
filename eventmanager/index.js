"use strict"
var express = require('express');
var app = express();
var port = 6560;

var bodyParser = require('body-parser');

var mysql      = require('mysql');
global.pool  = mysql.createPool({
	host     : '5.19.139.120',
	port	 : '3306',
	user     : 'EventManagerUser',
	password : 'EventManagerUser2016',
	database : 'EventOrganiser'
	});
global.Person = require('./routes/classes/person');
global.Event = require('./routes/classes/event')

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('public'));

var startPage = require('./routes/startpage');
var startEvent = require('./routes/startevent');

app.use('/', startPage);
app.use('/startevent', startEvent);

app.listen(port, function(){console.log("server started at port:"+port);});
"use strict"
var express = require('express');
var app = express();
var port = 6560;
/*-----------------------------------------*/
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
/*-----------------------------------------*/
global.Person = require('./modules/person');
global.Event = require('./modules/event');
global.DBConnection = require('./modules/dbconnection');
/*-----------------------------------------*/
app.use(express.static('public'));

var startPage = require('./routes/startpage');
var startEvent = require('./routes/startevent');

app.use('/', startPage);
app.use('/startevent', startEvent);
/*-----------------------------------------*/
app.listen(port, function(){console.log("server started at port:"+port);});
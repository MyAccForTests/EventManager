"use strict"
var express = require('express');
var routes = express.Router();
var path = require('path');
var generatePassword = require('password-generator');
var multer  = require('multer');
var upload = multer({dest: './public/userimages/', rename: function (fieldname, filename) {return Date.now()+generatePassword(4,true)+filename}})

routes.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname + '/../public/views/startevent.html'));
});

routes.post('/create',upload.single('img'), function(req, res) {
	var person=incPostParser.parsePerson(req);
	var ev=incPostParser.parseEvent(req);
	var pass=generatePassword(6, true);
	var lnk="i/"+generatePassword(11, false);
	var ownlnk="o/"+generatePassword(11, false);
	ev.pass=pass;
	ev.ownlnk=ownlnk;
	ev.lnk=lnk;
	console.log("incoming event:");
	console.log(ev);
	/*
	DBConnection.putEvent(ev,function(result)
	{
		console.log("inserted event, id: "+result.insertId);
	});
	emailSender.sendPassNotification(ev);
	*/
	res.send("Suceed");
});

routes.post('/email', function(req, res) {
	var person=req.body;
	DBConnection.getPersonByEmail(person, 
	function(user){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(user));
	});
});

module.exports = routes;
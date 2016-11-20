"use strict"
var express = require('express');
var router = express.Router();
var path = require('path');
var generatePassword = require('password-generator');
var multer  = require('multer');
var upload = multer({dest: './public/userimages/', rename: function (fieldname, filename) {return Date.now()+generatePassword(4,true)+filename}})

router.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname + '/../public/views/startevent.html'));
});

router.post('/create',upload.single('img'), function(req, res) {
	var person=incPostParser.parsePerson(req);
	var ev=incPostParser.parseEvent(req);
	var pass=generatePassword(6, true);
	var lnk="i/"+generatePassword(8, false)+Date.now();
	var ownlnk="o/"+generatePassword(8, false)+Date.now();
	var sublnk="s/"+generatePassword(8, false)+Date.now();
	ev.pass=pass;
	ev.ownlnk=ownlnk;
	ev.lnk=lnk;
	ev.sublnk=sublnk;
	console.log("incoming event:");
	console.log(ev);
	DBConnection.putEvent(ev,function(result)
	{
		console.log("inserted event, id: "+result.insertId);
	});
	emailSender.sendPassNotification(ev);
	console.log("event created");
	res.redirect(servSettings.server.address+ev.sublnk);
});

router.post('/email', function(req, res) {
	var person=req.body;
	console.log(person);
	DBConnection.getPersonByEmail(person, 
	function(user){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(user));
	});
});

module.exports = router;
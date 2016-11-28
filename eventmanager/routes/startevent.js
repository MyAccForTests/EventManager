"use strict"
var express = require('express');
var router = express.Router();
var path = require('path');
var generatePassword = require('password-generator');
var newEventParser = require('./../modules/newEventParser');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/userimages/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+generatePassword(5,false)+file.originalname.slice(file.originalname.lastIndexOf(".",file.originalname.length)))
  }
});
var upload = multer({ storage: storage });

router.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname + '/../public/views/startevent.html'));
});

router.post('/create',upload.single('img'), function(req, res) {
	var person=newEventParser.parseNewEventPerson(req);
	var ev=newEventParser.parseNewEventEvent(req);
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
		console.log("inserted event, id: "+result.insertId);							//check results, if err-notify user
		//emailSender.sendPassNotification(ev);											//send email success
		console.log("event created");
		res.redirect(servSettings.server.address+ev.sublnk);
	});
});

router.post('/email', function(req, res) {
	var person=req.body;
	console.log(person);
	DBConnection.getPersonByEmail(person, 
	function(user){
		res.setHeader('Content-Type', 'application/json');								//check results, if err-notify user
		res.send(JSON.stringify(user));
	});
});

module.exports = router;
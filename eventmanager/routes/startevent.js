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
	ev.ownlnk=ownlnk;
	ev.lnk=lnk;
	ev.sublnk=sublnk;
	console.log("incoming event:");
	if(ev.owner.pass=="")
	{
		ev.owner.pass=pass;
	}
	console.log(ev);
	DBConnection.putEvent(ev,function(result)
	{
		if(result=="db_error")
		{
			res.status(500).send('Server problem, try again later!');
		}
		else
		{
			if(result=="wrong_pass")
			{
				res.end("Wrong password");
			}
			else
			{
				console.log("inserted event, id: "+result.insertId);							
				emailSender.notifyEventCreation(ev);
				console.log("event created");
				res.redirect(servSettings.server.address+ev.sublnk);
			}	
		}
	});
});

router.post('/email', function(req, res) {
	var person=req.body;
	DBConnection.getPersonByEmail(person, 
	function(user){
		if(user=="db_error")
		{
			res.status(500).send('Server problem, try again later!');
		}
		else
		{
			user.pass="";
			res.setHeader('Content-Type', 'application/json');								
			res.send(JSON.stringify(user));
		}
	});
});

router.post('/newpass', function(req, res) {
	var person=req.body;
	var pass=generatePassword(6, true);
	person.pass=pass;
	DBConnection.updatePersonPass(person, 
	function(user){
		if(user=="db_error")
		{
			res.status(500).send('Server problem, try again later!');
		}
		else
		{
			res.setHeader('Content-Type', 'application/json');								
			res.send(JSON.stringify(true));
			emailSender.notifyNewPass(person);
		}
	});
});

router.post('/checkpass', function(req, res) {
	var person=req.body;
	DBConnection.getPersonByEmail(person, 
	function(user){
		if(user=="db_error")
		{
			res.status(500).send('Server problem, try again later!');
		}
		else
		{
			if(user.pass==person.pass)
			{
				res.setHeader('Content-Type', 'application/json');								
				res.send(JSON.stringify(true));
			}
			else
			{
				res.setHeader('Content-Type', 'application/json');								
				res.send(false);
			}
		}
	});
});

module.exports = router;
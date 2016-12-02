"use strict"
var express = require('express');
var router = express.Router();
var path = require('path');
var generatePassword = require('password-generator');

router.get('/*', function(req, res) {
	var lnk = req.originalUrl;
	DBConnection.getEventByLink(lnk, function(ev)								
	{
		if(ev=="db_error")
		{
			res.status(500).send('Server problem, try again later!');
		}
		else if(lnk!="/"+ev.ownlnk)
		{
			res.status(404).send();
		}
		else
		{
			res.render(__dirname + '/../public/views/ownerpagepass.ejs',
			{
				evID		:	ev.id,
				userID		:	ev.owner.id,
				email		:	ev.owner.email,
			});
			console.log("OwnerPagePassword page sended")
		}
	});
});

router.post('/newpass', function(req, res) {
	var person=new Person("",req.body.email);
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
			//emailSender.sendPassNotification(ev);											//send email new password
		}
	});
});

router.post('/login', function(req, res) {
	var owner=new Person("","");
	owner.id=req.body.userID;
	var evID=req.body.evID;
	var pass=req.body.pass;
	DBConnection.getEventByID(evID, function(ev)								
	{
		if(ev=="db_error")
		{
			res.status(500).send('Server problem, try again later!');
		}
		else if(owner.id!=ev.owner.id)
		{
			res.writeHead(200, {'Content-Type': 'text/event-stream'});								
			res.end("wrong_data");
		}
		else if(pass!=ev.owner.pass)
		{
			res.writeHead(200, {'Content-Type': 'text/event-stream'});								
			res.end("wrong_pass");
		}
		else
		{
			req.session.result=
			{
				evID	:	evID,
				userID	:	owner.id
			}
			res.writeHead(200, {'Content-Type': 'text/event-stream'});								
			res.end("/ownerpage");
		}
	});
});

module.exports = router;
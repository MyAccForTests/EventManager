"use strict"
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/*', function(req, res) {
	var lnk = req.originalUrl;
	DBConnection.getEventByLink(lnk, function(ev)								//check results, if err-notify user, if no link-send error page
	{
		var capC="Total space:";
		var leftL="Left space:";
		var leftS="0";
		var prP="Price:";
		if(ev.img=="")
		{
			ev.img= '../images/eventInviteImagePlaceholder.jpg';
		}
		else 
		{
			ev.img="../"+ev.img.replace('\public','/').replace("\\",'/')
		}
		if(ev.capacity==-1)
		{
			ev.capacity="";
			capC="";
			leftL="";
			leftS="";
		}
		if(ev.price==-1)
		{
			ev.price="";
			prP="";
		}
		res.render(__dirname + '/../public/views/invitepage.ejs',
		{
			image		:	ev.img,
			title		:	ev.title,
			ownerName	:	ev.owner.name,
			dateStart	:	ev.date.toLocaleString(),
			dateReg		:	ev.datereg.toLocaleString(),
			capacityC	:	capC,
			capacity	:	ev.capacity,
			leftSpaceL	:	leftL,
			leftSpace	:	leftS,														//count
			priceP		:	prP,
			price		:	ev.price,
			description	:	ev.description,
			evID		:	ev.id
		});
		console.log("invite page sended");
	});
});

router.post('/sub', function(req, res) {
	var userID;
	var evID=req.body.evID;
	var person=new Person(req.body.name,req.body.email);
	if(req.body.userID===undefined||req.body.userID=="")
	{
		DBConnection.putPerson(person, function(result){
			userID=result.insertId;
			subsc(userID, evID, res);
		});
	}
	else
	{
		userID=req.body.userID;
		DBConnection.getPersonById(userID,function(user){
			if(user.name!=req.body.name)
			{;
				DBConnection.updatePersonName(person,function(result){
					subsc(userID, evID, res);
				});
			}
			else
			{
				subsc(userID, evID, res);	
			}					
		});
	}	
});
var subsc = function(userID, evID, res)
{
	DBConnection.subscribe(userID, evID, function(result)								//check results, if err-notify user, if no link-send error page
	{
		res.writeHead(200, {'Content-Type': 'text/event-stream'});
			var sub=
			{
				userID	:	userID,
				evID	:	evID
			}
		res.end(JSON.stringify(sub));
		//emailSender.sendPassNotification(ev);											//send email
	});
}

router.post('/unsub', function(req, res) {
	var userID=req.body.userID;
	var evID=req.body.evID;
	DBConnection.unsubscribe(userID, evID, function(result)								//check results, if err-notify user, if no link-send error page
	{
		res.writeHead(200, {'Content-Type': 'text/event-stream'});
		res.end();																		
		//emailSender.sendPassNotification(ev);											//send email
	});
});

router.post('/email', function(req, res) {
	var person=req.body;
	DBConnection.getPersonByEmail(person, 
	function(user){
		res.setHeader('Content-Type', 'application/json');								//check results, if err-notify user
		res.send(JSON.stringify(user));
	});
});

router.post('/user', function(req, res) {
	var id=req.body.id;
	DBConnection.getPersonById(id, 
	function(user){
		res.setHeader('Content-Type', 'application/json');								//check results, if err-notify user
		res.send(JSON.stringify(user));
	});
});

module.exports = router;
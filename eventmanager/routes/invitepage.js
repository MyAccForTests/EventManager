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
			leftSpace	:	leftS,												//count
			priceP		:	prP,
			price		:	ev.price,
			description	:	ev.description
		});
		console.log("invite page sended");
	});
});

router.get('/participate', function(req, res) {
	
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
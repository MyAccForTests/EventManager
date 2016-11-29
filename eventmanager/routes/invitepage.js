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
		if(ev.img==null)
		{
			ev.img= '../images/eventInviteImagePlaceholder.png';
		}
		else 
		{
			ev.img="../"+ev.img.replace('\public','/').replace("\\",'/')
		}
		if(ev.capacity==null)
		{
			ev.capacity="";
			capC="";
			leftL="";
			leftS="";
		}
		if(ev.price==null)
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

router.post('/getfreespace', function(req, res) {
	DBConnection.countFreeSpace(req.body.evID, function(result){
		res.writeHead(200, {'Content-Type': 'text/event-stream'});
		res.end(JSON.stringify(result));
	});
});

router.post('/sub', function(req, res) {
	var nowDate=new Date();
	var dateReg=new Date(req.body.dateReg);
	if(nowDate>dateReg)
	{
		res.writeHead(200, {'Content-Type': 'text/event-stream'});
		res.end("reg_closed");
	}
	else
	{
		var userID=req.body.userID;
		var evID=req.body.evID;
		var person=new Person(req.body.name,req.body.email);
		if(userID===undefined||userID=="")
		{
			DBConnection.putPerson(person, function(result){
				userID=result.insertId;
				subsc(userID, evID, res);
			});
		}
		else
		{
			DBConnection.getPersonById(userID,function(user){
				if(user.name!=req.body.name)
				{
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
	}
});
	
	


var subsc = function(userID, evID, res)
{
	DBConnection.countFreeSpace(evID, function(result){
		if(result>0||result==null)
		{
			DBConnection.subscribe(userID, evID, function(result2)								//check results, if err-notify user, if no link-send error page
			{
				res.writeHead(200, {'Content-Type': 'text/event-stream'});
				var sub=
				{
					userID		:	userID,
					evID		:	evID,
				}
				res.end(JSON.stringify(sub));
				//emailSender.sendPassNotification(ev);											//send email
			});
		}
		else
		{
			res.writeHead(200, {'Content-Type': 'text/event-stream'});
			res.end("no_space");
		}
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
	var person=new Person("",req.body.email);
	var evID=req.body.evID;
	DBConnection.getPersonByEmail(person, 
	function(user){
		DBConnection.checkUserSubscribsion(user.id, evID, 
		function(count){
			var wasSubscribed=false;
			if(count>0)
			{
				wasSubscribed=true;
			}
			var sub=
				{
					user				:	user,
					wasSubscribed		:	wasSubscribed,
				}
			res.setHeader('Content-Type', 'application/json');								//check results, if err-notify user
			res.send(JSON.stringify(sub));
		});
	});
});

router.post('/user', function(req, res) {
	var userID=req.body.userID;
	var evID=req.body.evID;
	DBConnection.checkUserSubscribsion(userID, evID,
	function(count){
		var isSubscribed=false;
		if(count>0)
		{
			isSubscribed=true;
		}
		DBConnection.getPersonById(userID, 
			function(user){
			res.setHeader('Content-Type', 'application/json');								//check results, if err-notify user
			var sub=
			{
				user				:	user,
				isSubscribed		:	isSubscribed,
			}
			res.send(JSON.stringify(sub));
		});
	});
});

module.exports = router;
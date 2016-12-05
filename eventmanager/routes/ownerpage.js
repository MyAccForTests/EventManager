"use strict"
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
	if (req.session.data) {
		res.sendFile(path.resolve(__dirname + '/../public/views/ownerpage.html'));
		console.log("OwnerPage page sended");
	}
	else
	{
		exit(res);
	}
});

router.get('/exit', function(req, res) {
	if (req.session.data) {
		req.session.destroy(function(err) {
			if(err)
			{
				console.log("error while log out");
			}
			else
			{
				exit(res);
			}
			
		})
	}
	else
	{
		exit(res);
	}
});

router.get('/name', function(req, res) {
	if (req.session.data) 
	{
		DBConnection.getPersonById(req.session.data.userID,function(user){
				if(user=="db_error")
				{
					res.status(500).send('Server problem, try again later!');
				}
				else
				{
					res.writeHead(200, {'Content-Type': 'text/event-stream'});
					res.end(user.name);
				}
		});
	}
	else
	{
		exit(res);
	}
});

router.post('/getevent', function(req, res) {
	if (req.session.data) 
	{
		DBConnection.getEventByID(req.session.data.evID,function(ev){
			if(ev=="db_error")
			{
				res.status(500).send('Server problem, try again later!');
			}
			else
			{
				var sub=
				{
					title		:	ev.title,
					description	:	ev.description,
					email		:	ev.owner.email,
					name		:	ev.owner.name,
					date		:	ev.date,
					datereg		:	ev.datereg,
					img			:	ev.img,
					price		:	ev.price,
					capacity	:	ev.capacity
				}	
				res.send(sub);
			}
		});
	}
	else
	{
		exit(res);
	}
});

router.post('/updateevent', function(req, res) {
	if (req.session.data) 
	{
		var person=new Person(req.body.name, req.body.email);
		person.id=req.session.userID;
		var ev=new Event(req.body.title, req.body.description, person, req.body.capacity, req.body.price, new Date(req.body.date).toISOString().slice(0, 19), new Date(req.body.datereg).toISOString().slice(0, 19), "", "", "", req.body.img);
		ev.id=req.session.data.evID;
		DBConnection.updateEvent(ev,function(ev){
			if(ev=="db_error")
			{
				res.status(500).send('Server problem, try again later!');
			}
			else
			{
				DBConnection.getEventByID(req.session.data.evID,function(ev){
					if(ev=="db_error")
					{
						res.status(500).send('Server problem, try again later!');
					}
					else
					{
						var sub=
						{
							title		:	ev.title,
							description	:	ev.description,
							email		:	ev.owner.email,
							name		:	ev.owner.name,
							date		:	ev.date,
							datereg		:	ev.datereg,
							img			:	ev.img,
							price		:	ev.price,
							capacity	:	ev.capacity
						}	
						res.send(sub);
					}
				});
			}
		});
	}
	else
	{
		exit(res);
	}
});

var exit = function(res)
{
	res.redirect(servSettings.server.address);
}

module.exports = router;
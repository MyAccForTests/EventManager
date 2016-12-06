"use strict"
var express = require('express');
var Busboy = require('busboy');
var router = express.Router();
var path = require('path');
var generatePassword = require('password-generator');
var multer  = require('multer');
var path = require('path');
var fs = require('fs');

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

router.post('/getsubscribers', function(req, res) {
	if (req.session.data) 
	{
		DBConnection.getSubscribers(req.session.data.evID,function(result){
			if(result=="db_error")
			{
				res.status(500).send('Server problem, try again later!');
			}
			else
			{
				res.send(result);
			}
		});
	}
	else
	{
		exit(res);
	}
});

router.post('/unsubscribeuser', function(req, res) {
	if (req.session.data) 
	{
		DBConnection.getPersonById(req.body.userID,function(user){
			if(user=="db_error")
			{
				res.status(500).send('Server problem, try again later!');
			}
			else 
			{
				DBConnection.unsubscribe(req.body.userID,req.session.data.evID,function(result){
					if(result=="db_error")
					{
						res.status(500).send('Server problem, try again later!');
					}
					else
					{
						res.send(result);
						emailSender.notifyUnsubscByOwner(user);
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

router.post('/updateevent', function(req, res) {
	if (req.session.data) 
	{
		var data;
		var img="";
		var busboy = new Busboy({ headers: req.headers });
		busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			img='public/userimages/'+Date.now()+generatePassword(5,false)+filename.slice(filename.lastIndexOf(".",filename.length));
			var saveTo = path.resolve(__dirname +'/../'+img);
			file.pipe(fs.createWriteStream(saveTo));
			file.on('data', function(data) {
			});
			file.on('end', function() {
			});
		});
			
		busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
			data=JSON.parse(val);
		});
			
		busboy.on('finish', function() {
			data.img=img;
			var person=new Person(data.name, data.email);
			person.id=req.session.userID;
			var ev=new Event(data.title, data.description, person, data.capacity, data.price, new Date(data.date).toISOString().slice(0, 19), new Date(data.datereg).toISOString().slice(0, 19), "", "", "", data.img);
			ev.id=req.session.data.evID;
			DBConnection.updateEvent(ev,function(result){
				if(result=="db_error")
				{
					res.status(500).send('Server problem, try again later!');
					if(img!="") {fs.unlink(img)}
				}
				else if(result=="capacity_limit")
				{
					res.end("capacity_limit");
					if(img!="") {fs.unlink(img)}
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
							if(result.oldimg!=null&&result.oldimg!=img&&img!="")
							{
								fs.unlink(result.oldimg);
							}
							var data=
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
							res.send(data);
							emailSender.notifyEventUpdate(ev);							
						}
					});
				}
			});
		});
	req.pipe(busboy);
	req.on("close", function(err) {
		if(img!="") 
		{
			fs.end();
			fs.unlink(img);
			console.log("File load fail,file parts deleted");
		}
		res.status(500).send('Error during request, try again later!');
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
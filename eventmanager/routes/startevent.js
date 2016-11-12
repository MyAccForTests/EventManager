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
	var person=new Person(req.body.name, req.body.email);
	console.log(person);
	
	var pass=generatePassword();
	var lnk="g"+generatePassword(11, false);
	var ownlnk="o"+generatePassword(11, false);
	var dateEventLong=Date.parse(req.body.date);
	var dateRegLong=Date.parse(req.body.datereg);
	var imgLink="";
	if(req.file===undefined){}else{imgLink=req.file.path;};
	var eve=new Event(req.body.title, pass, req.body.description, person, req.body.capacity, req.body.price, dateEventLong, dateRegLong, ownlnk, lnk ,imgLink);
	console.log(eve);
	
	
	/*
	var personSQL="INSERT INTO person (Name, Email) VALUES ("+person.name+", "+person.email+");";
	var person.id=connection.query("SELECT id FROM person WHERE ")
	var eventSQL="INSERT INTO event (eve.title, eve.pass, eve. description, 0";
	
	
	
	var sqlColE="INSERT INTO event (";
	var sqlValE="VALUES ("
	
	var sqlColP="INSERT INTO event (";
	var sqlValP="VALUES ("
	
	if(title != "")
	{
		sqlValE+=","+title;
		sqlColE+="Title,"
	}
	if(description != "")
	{
		sqlValE+=description+",";
		sqlColE+="Description,"
	}
	if(date != "")
	{
		sqlValE+=date+",";
		sqlColE+="Date,"
	}
	if(capacity != "")
	{
		sqlValE+=capacity+",";
		sqlColE+="Capacity,"
	}
	if(price != "")
	{
		sqlValE+=price+",";
		sqlColE+="Price,"
	}
	if(datereg != "")
	{
		sqlValE+=datereg+",";
		sqlColE+="Deadline,"
	}
	if(img != "")
	{
		sqlValE+=img+",";
		sqlColE+="Link,"
	}
	var sql = sqlColE+") "+sqlValE+");";
	*/
	
	/*
	console.log(title);
	console.log(description);
	console.log(email);
	console.log(name);
	console.log(date);
	console.log(datereg);
	console.log(capacity);
	console.log(price);
	console.log(img);
	
	console.log(sql);
	*/
	/*
	console.log(req.body.title);
	console.log(req.body.description);
	console.log(req.body.email);
	console.log(req.body.name);
	console.log(req.body.date);
	console.log(req.body.datereg);
	console.log(req.body.price);
	console.log(req.body.img);
	console.log(req.body);
	*/
	pool.getConnection(function(err, connection) {
	console.log('connected as id ' + connection.threadId);
	
	connection.release();
	console.log('connection released');
	});
	
	res.send("Suceed");
	res.end;
});

module.exports = routes;
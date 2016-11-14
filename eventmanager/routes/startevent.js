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
	var name=req.body.name;
	var email=req.body.email;
	
	var person=new Person(name, email);
	console.log(person);
	/*-----------------------------------------*/
	var title=req.body.title;
	var description=req.body.description;
	var capacity=req.body.capacity;
	var price=req.body.price;
	var imgLink="";
	if(req.file===undefined){}else{imgLink=req.file.path;};
	
	var dateEventLong=Date.parse(req.body.date);
	var dateRegLong=Date.parse(req.body.datereg);
	
	var pass=generatePassword(6, true);
	var invLnk="i/"+generatePassword(11, false);
	var ownlnk="o/"+generatePassword(11, false);
	
	var eve=new Event(title, pass, description, person, capacity, price, dateEventLong, dateRegLong, ownlnk, invLnk ,imgLink);
	console.log(eve);
	/*-----------------------------------------*/
	
	res.send("Suceed");
});

routes.post('/email', function(req, res) {
	var person=new Person(req.body.name,req.body.email);
	DBConnection.getPersonByEmail(person, 
	function(user){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(user));
	});
});

module.exports = routes;
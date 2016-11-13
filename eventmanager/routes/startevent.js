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
	
	var pass=generatePassword(6, true);
	var lnk="i/"+generatePassword(11, false);
	var ownlnk="o/"+generatePassword(11, false);
	var dateEventLong=Date.parse(req.body.date);
	var dateRegLong=Date.parse(req.body.datereg);
	var imgLink="";
	if(req.file===undefined){}else{imgLink=req.file.path;};
	var eve=new Event(req.body.title, pass, req.body.description, person, req.body.capacity, req.body.price, dateEventLong, dateRegLong, ownlnk, lnk ,imgLink);
	console.log(eve);
	
	res.send("Suceed");
});

routes.post('/mail', function(req, res) {
	var person=new Person(req.body.name, req.body.email);
	console.log(person.email);
	
	
	DBConnection.getPersonByEmail("aaa@bbb.ccc", 
	function(user){
		console.log(user)
		
		res.end();
		
	});
});

module.exports = routes;
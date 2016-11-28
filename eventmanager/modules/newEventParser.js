"use strict"
var express = require('express');

var parseNewEventPerson = function(req)
{
	return new Person(req.body.name, req.body.email);
}

var parseNewEventEvent = function(req)
{
	var imgLink="";
	var price=req.body.price;
	var capacity=req.body.capacity;
	if(capacity==""){capacity=null};
	if(price==""){price=null};
	if(req.file===undefined){}else{imgLink=req.file.path;};
	return new Event(req.body.title, "", req.body.description, new Person(req.body.name, req.body.email), capacity, price, new Date(req.body.date).toISOString().slice(0, 19).replace('T', ' '), new Date(req.body.datereg).toISOString().slice(0, 19).replace('T', ' '), "", "", "", imgLink)
}

module.exports.parseNewEventPerson = parseNewEventPerson;
module.exports.parseNewEventEvent = parseNewEventEvent;
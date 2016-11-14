"use strict"
var express = require('express');
var mysql      = require('mysql');
var fs = require('fs');
var pool;
fs.readFile('./settings/settings_db.txt','utf8',function (err,data) {
  if (err) {
    return console.log(err);
  }
  pool  = mysql.createPool(JSON.parse(data));
});

var putPerson = function(person)
{
	
}

var putEvent = function(event)
{
	
}

var getPersonByEmail = function(person, cb)
{
	pool.getConnection(function(err, connection) {
		if(err) {console.log('cannot estabilish connection for getPersonByEmail()');} else{console.log('connected for getPersonByEmail() as id '+connection.threadId);};
		connection.query('SELECT `Name`, `Email` from `person` WHERE `Email`=?', [person.email],
			function(err, results, fields)
			{
				if(err) {console.log('query from getPersonByEmail() unsuccessful');};
				console.log('receivied for getPersonByEmail() from base: '+results.length+' results');
				if(results.length == 0)
				{
					var user=new Person("", "");
				}
				else
				{
					var name = results[0].Name;
					var email= results[0].Email;
					var user=new Person(name, email);
				}
				cb(user);
			});
			connection.release();
			console.log('connection released for getPersonByEmail()');
		});
}

module.exports.putPerson = putPerson;
module.exports.putEvent = putEvent;
module.exports.getPersonByEmail = getPersonByEmail;
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

var putPerson = function(person, cb)
{
	pool.getConnection(function(err, connection) {
		if(err) {console.log('cannot estabilish connection for putPerson()');} else{console.log('connected for putPerson() as id '+connection.threadId);};
		connection.query('INSERT INTO person (name, email) VALUES (?,?)', [[person.name],[person.email]],
			function(err, result)
			{
				if(err) {console.log('query from putPerson() unsuccessful');}
				else{console.log('putting to db for putPerson() successful')}
				connection.release();
				console.log('connection released for putPerson()');
				cb(result);
			});
		});

}

var putEvent = function(ev,cb)
{
	pool.getConnection(function(err, connection) {
		if(err) {console.log('cannot estabilish connection for putEvent()');} else{console.log('connected for putEvent() as id '+connection.threadId);};
			getPersonByEmail(ev.owner,
			function(user)
			{
				var addEve=function(id) {connection.query('INSERT INTO event (Password, Title, Description, Owner, Capacity, Price, OwnerLink, Date, Deadline, Link, Image) VALUES (?,?,?,?,?,?,?,?,?,?,?)', 
				[[ev.pass],[ev.title],[ev.description],id,[ev.capacity],[ev.price],[ev.ownlnk],[ev.date],[ev.datereg],[ev.lnk],[ev.img]],
				function(err, result)
				{
				if(err) {
					console.log('query from putEvent() unsuccessful');
					console.log(err);}
				else{console.log('putting to db for putEvent() successful')};
				connection.release();
				console.log('connection released for putEvent()');
				cb(result);
				});
				};
				if(user.email=="")
				{
					
					putPerson(ev.owner,
					function(results)
					{
					addEve(results.insertId);
					});
				}
				else
				{
					addEve(user.id);
				}
			});
			
		});
}

var getPersonByEmail = function(person, cb)
{
	pool.getConnection(function(err, connection) {
		if(err) {console.log('cannot estabilish connection for getPersonByEmail()');} else{console.log('connected for getPersonByEmail() as id '+connection.threadId);};
		connection.query('SELECT id, Name, Email from person WHERE Email=?', [person.email],
			function(err, results, fields)
			{
				if(err) {console.log('query from getPersonByEmail() unsuccessful');}
				else{console.log('receivied for getPersonByEmail() from base: '+results.length+' results')};
				if(results.length == 0)
				{
					var user=new Person("", "");
				}
				else
				{
					var id = results[0].id;
					var name = results[0].Name;
					var email= results[0].Email;
					var user=new Person(name, email);
					user.id=id;
				}
				connection.release();
				console.log('connection released for getPersonByEmail()');
				cb(user);
			});
			
		});
}

module.exports.putPerson = putPerson;
module.exports.putEvent = putEvent;
module.exports.getPersonByEmail = getPersonByEmail;
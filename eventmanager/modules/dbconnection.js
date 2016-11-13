"use strict"
var express = require('express');
var mysql      = require('mysql');

var pool  = mysql.createPool({
	host     : '5.19.139.120',
	port	 : '3306',
	user     : 'EventManagerUser',
	password : 'EventManagerUser2016',
	database : 'EventOrganiser'
	});

var getPersonByEmail = function(email, cb)
{
	pool.getConnection(function(err, connection) {
		if(err) {console.log("cannot estabilish connection");} else{console.log('connected as id '+connection.threadId);};
		connection.query('SELECT `Name`, `Email` from `person` WHERE `Email`=?', [email],
			function(err, results, fields)
			{
				if(err) {console.log("query unsuccessful");};
				
				
				
				var user=new Person("name", "email");
				cb(user);
			});
			connection.release();
			console.log('connection released');
		});
}

module.exports.getPersonByEmail = getPersonByEmail;
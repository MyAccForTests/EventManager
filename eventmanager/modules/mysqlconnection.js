"use strict"
var express = require('express');
var mysql = require('mysql');
var pool = mysql.createPool(servSettings.database);

var countFreeSpace = function(evID, res)
{
	pool.getConnection(function(err, connection) {
		if(err) 
		{
			console.log('cannot estabilish connection for countFreeSpace()');
			res(err);
		} 
		else
		{
			console.log('connected for countFreeSpace() as id '+connection.threadId);
			connection.query('SELECT ev.evCapacity-IFNULL(ep.reservedSpace,0) as freeSpace FROM (SELECT id as evID, Capacity as evCapacity FROM event WHERE Capacity IS NOT NULL) as ev LEFT OUTER JOIN (SELECT Event as epEvent, COUNT(Event) as reservedSpace FROM eventperson GROUP BY Event) as ep ON ev.evID = ep.epEvent WHERE ev.evID=?', [evID],
			function(err, results, fields)
			{
				if(err) 
				{
					console.log('query from countFreeSpace() unsuccessful');
					connection.release();
					console.log('connection released after bad query in countFreeSpace()');
					res(err);
				}
				else
				{
					console.log('receivied for countFreeSpace() from base: '+results.length+' results')
					connection.release();
					console.log('connection released for countFreeSpace()');
					var freeSpace = results[0].freeSpace;
					res(freeSpace);
				};
			});
		};
	});
}

var getPersonsIDByEventId = function(evID, res)
{
	pool.getConnection(function(err, connection) {
		if(err) 
		{
			console.log('cannot estabilish connection for getPersonsIDByEventId()');
			res(err);
		} 
		else
		{
			console.log('connected for getPersonsIDByEventId() as id '+connection.threadId);
			connection.query('SELECT Person FROM eventperson WHERE Event=?', [evID],
			function(err, results, fields)
			{
				if(err) 
				{
					console.log('query from getPersonsIDByEventId() unsuccessful');
					connection.release();
					console.log('connection released after bad query in getPersonsIDByEventId()');
					res(err);
				}
				else
				{
					console.log('receivied for getPersonsIDByEventId() from base: '+results.length+' results')
					connection.release();
					console.log('connection released for getPersonsIDByEventId()');
					res(results);
				};
			});
		};
	});
}
 
var unsubscribe = function(personID, evID, res)
{
	pool.getConnection(function(err, connection) {
		if(err)
		{
			console.log('cannot estabilish connection for unsubscribe()');
		} 
		else
		{
			console.log('connected for unsubscribe() as id '+connection.threadId);
			connection.query('DELETE FROM eventperson WHERE Person=? AND Event=?', [[personID],[evID]],
			function(err, result)
			{
				if(err) 
				{
					console.log('query from unsubscribe() unsuccessful');
					connection.release();
					console.log('connection released after bad query in unsubscribe()');
					res(err);
				}
				else
				{
					console.log('putting to db for unsubscribe() successful')
					connection.release();
					console.log('connection released for unsubscribe()');
					res(result);
				}
			});
		};
	});
}

var subscribe = function(personID, evID, res)
{
	pool.getConnection(function(err, connection) {
		if(err)
		{
			console.log('cannot estabilish connection for subscribe()');
		} 
		else
		{
			console.log('connected for subscribe() as id '+connection.threadId);
			connection.query('INSERT INTO eventperson (Person, Event) VALUES (?,?)', [[personID],[evID]],
			function(err, result)
			{
				if(err) 
				{
					console.log('query from subscribe() unsuccessful');
					connection.release();
					console.log('connection released after bad query in subscribe()');
					res(err);
				}
				else
				{
					console.log('putting to db for subscribe() successful')
					connection.release();
					console.log('connection released for subscribe()');
					res(result);
				}
			});
		};
	});
}
 
var putPerson = function(person, res)
{
	pool.getConnection(function(err, connection) {
		if(err)
		{
			console.log('cannot estabilish connection for putPerson()');
			res(err);
		} 
		else
		{
			console.log('connected for putPerson() as id '+connection.threadId);
			connection.query('INSERT INTO person (name, email) VALUES (?,?)', [[person.name],[person.email]],
			function(err, result)
			{
				if(err) 
				{
					console.log('query from putPerson() unsuccessful');
					connection.release();
					console.log('connection released after bad query in putPerson()');
					res(err);
				}
				else
				{
					console.log('putting to db for putPerson() successful')
					connection.release();
					console.log('connection released for putPerson()');
					res(result);
				}
			});
		};
	});
}

var updatePersonName = function(person, res)
{
	pool.getConnection(function(err, connection) {
		if(err) 
		{
			console.log('cannot estabilish connection for updatePerson()');
			connection.release();
			res(err);
		} 
		else
		{
			console.log('connected for updatePerson() as id '+connection.threadId);
			connection.query('UPDATE person SET name=? WHERE email=?', [[person.name],[person.email]],
			function(err, result)
			{
				if(err) 
				{
					console.log('query from updatePerson() unsuccessful');
					connection.release();
					console.log('connection released after bad query in updatePerson()');
					res(err);
				}
				else
				{
					console.log('putting to db for updatePerson() successful')
					connection.release();
					console.log('connection released for updatePerson()');
					res(result);
				}
			});
		};
	});
}

var putEvent = function(ev,res)
{
	pool.getConnection(function(err, connection) {
		if(err) 
		{
			console.log('cannot estabilish connection for putEvent()');
			res(err);
		} 
		else
		{
			console.log('connected for putEvent() as id '+connection.threadId);
			if(ev.owner==""||ev.owner===undefined) ev.owner=new Person("","");
			getPersonByEmail(ev.owner,
			function(user)
			{
				var addEve=function(id) {connection.query('INSERT INTO event (Password, Title, Description, Owner, Capacity, Price, OwnerLink, SubmitLink, Date, Deadline, Link, Image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', 
				[[ev.pass],[ev.title],[ev.description],[id],[ev.capacity],[ev.price],[ev.ownlnk],[ev.sublnk],[ev.date],[ev.datereg],[ev.lnk],[ev.img]],
				function(err, result)
					{
						if(err) 
						{
							console.log('query from putEvent() unsuccessful');
							connection.release();
							console.log('connection released after bad query in putEvent()');
							res(err);
						}
						else
						{
							console.log('putting to db for putEvent() successful')
							connection.release();
							console.log('connection released for putEvent()');
							res(result);
							
						}
					}
				)}
				if(ev.owner.name!=user.name)
				{
					updatePersonName(ev.owner,function(result){console.log("users updated: "+result.changedRows);});
				}
				if(user.email=="")
				{
					putPerson(ev.owner,
					function(result)
					{
						addEve(result.insertId);
					});
				}
				else
				{
					addEve(user.id);
				}
			});
		};
	});
}

var getPersonByEmail = function(person, res)
{
	pool.getConnection(function(err, connection) {
		if(err) 
		{
			console.log('cannot estabilish connection for getPersonByEmail()');
			res(err);
		} 
		else
		{
			console.log('connected for getPersonByEmail() as id '+connection.threadId);
			connection.query('SELECT id, Name, Email FROM person WHERE Email=?', [person.email],
			function(err, results, fields)
			{
				if(err) 
				{
					console.log('query from getPersonByEmail() unsuccessful');
					connection.release();
					console.log('connection released after bad query in getPersonByEmail()');
					res(err);
				}
				else
				{
					console.log('receivied for getPersonByEmail() from base: '+results.length+' results')
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
					res(user);
				};
			});
		};
	});
}

var getEventByLink = function(lnk, res)
{
	pool.getConnection(function(err, connection) {
		if(err) 
		{
			console.log('cannot estabilish connection for getEventByLink()');
			res(err);
		} 
		else
		{
			console.log('connected for getEventByLink() as id '+connection.threadId);
			var llnk;
			lnk=lnk.slice(1,lnk.length);
			if(lnk.slice(0,1)=="i") llnk="Link";
			if(lnk.slice(0,1)=="o") llnk="OwnerLink";
			if(lnk.slice(0,1)=="s") llnk="SubmitLink";
			connection.query('SELECT id, Password, Title, Description, Owner, Capacity, Price, Date, Deadline, Link, OwnerLink, SubmitLink, Image FROM event WHERE '+llnk+'=?', [lnk],
			function(err, results, fields)
			{
				if(err) 
				{
					console.log('query from getEventByLink() unsuccessful');
					connection.release();
					console.log('connection released after bad query in getEventByLink()');
					res(err);
				}
				else
				{
					console.log('receivied for getEventByLink() from base: '+results.length+' results')
					if(results.length == 0)
					{
						var ev=new Event("", "", "", "", "", "", "", "", "", "", "", "");
						res(ev);
					}
					else
					{
						var id = results[0].id;
						var pass = results[0].Password;
						var title= results[0].Title;
						var description= results[0].Description;
						var ownerId= results[0].Owner;
						var capacity= results[0].Capacity;
						var price= results[0].Price;
						var date= new Date(results[0].Date);
						var datereg= new Date(results[0].Deadline);
						var lnk= results[0].Link;
						var ownlnk= results[0].OwnerLink;
						var sublnk= results[0].SubmitLink;
						var img= results[0].Image;
						getPersonById(ownerId, function(user)
						{
							var owner=user;
							var ev=new Event(title, pass, description, owner, capacity, price, date, datereg, ownlnk, lnk, sublnk, img);
							ev.id=id;
							res(ev);
						});
					}
					connection.release();
					console.log('connection released for getEventByLink()');
				}
			});
		};
	});
}

var getPersonById = function(id, res)
{
	pool.getConnection(function(err, connection) {
		if(err) 
		{
			console.log('cannot estabilish connection for getPersonById()');
			res(err);
		} 
		else
		{
			console.log('connected for getPersonById() as id '+connection.threadId);
			connection.query('SELECT id, Name, Email FROM person WHERE id=?', [id],
			function(err, results, fields)
			{
				if(err) 
				{
					console.log('query from getPersonById() unsuccessful');
					connection.release();
					console.log('connection released after bad query in getPersonById()');
					res(err);
				}
				else
				{
					console.log('receivied for getPersonById() from base: '+results.length+' results')
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
					console.log('connection released for getPersonById()');
					res(user);
				};
			});
		};
	});
}

module.exports.countFreeSpace = countFreeSpace;
module.exports.putPerson = putPerson;
module.exports.putEvent = putEvent;
module.exports.getPersonsIDByEventId = getPersonsIDByEventId;
module.exports.updatePersonName = updatePersonName;
module.exports.getPersonByEmail = getPersonByEmail;
module.exports.getEventByLink = getEventByLink;
module.exports.getPersonById = getPersonById;
module.exports.subscribe = subscribe;
module.exports.unsubscribe = unsubscribe;
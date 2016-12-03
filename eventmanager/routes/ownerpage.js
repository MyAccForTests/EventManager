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

var exit = function(res)
{
	res.redirect(servSettings.server.address);
}

module.exports = router;
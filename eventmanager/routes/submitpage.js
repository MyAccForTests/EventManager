"use strict"
var express = require('express');
var router = express.Router();

router.get('/*', function(req, res) {
	var lnk = req.originalUrl;
	DBConnection.getEventByLink(lnk, function(ev)								
	{
		if(ev=="db_error")
		{
			res.status(500).send('Server problem, try again later!');
		}
		else
		{
			res.render(__dirname + '/../public/views/submitevent.ejs',
			{
				h1		:	'Congratulations!',
				h2		:	'You have successfully created an event.',
				lnk		:	servSettings.server.address + ev.lnk,
				ownlnk	:	servSettings.server.address + ev.ownlnk
			});
			console.log("submit page sended");
		}
	});
});

module.exports = router;
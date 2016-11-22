"use strict"
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/*', function(req, res) {
	var lnk = req.originalUrl;
	DBConnection.getEventByLink(lnk, function(ev)								//check results, if err-notify user, if no link-send error page
	{
		console.log("../"+ev.img.replace('\\public\\','/');
		res.render(__dirname + '/../public/views/invitepage.ejs',
		{
			image		:	"../"+ev.img.replace('\\public\\','/'),
			title		:	ev.title,
			ownerName	:	ev.owner.name,
			dateStart	:	ev.date,
			dateReg		:	ev.datereg,
			capacity	:	ev.capacity,
			leftSpace	:	"0",												//count
			price		:	ev.price,
			description	:	ev.description
		});
		console.log("invite page sended");
	});
});

module.exports = router;
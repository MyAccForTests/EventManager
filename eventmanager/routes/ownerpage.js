"use strict"
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
	if (req.session.result) {
		res.sendFile(path.resolve(__dirname + '/../public/views/ownerpage.html'));
		console.log("OwnerPage page sended");
	}
	else
	{
		exit(res);
	}
});

router.get('/exit', function(req, res) {
	if (req.session.result) {
		req.session.destroy(function(err) {
			exit(res);
		})
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
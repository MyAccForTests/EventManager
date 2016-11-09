var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
	console.log(req.body.email+" "+req.body.pass);
	
	res.send("Hello World!");
});

module.exports = router;

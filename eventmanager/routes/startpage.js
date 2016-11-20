"use strict"
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../public/views/startpage.html'));
});

module.exports = router;
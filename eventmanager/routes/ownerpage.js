"use strict"
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/*', function(req, res) {
  res.send("You are an owner");
});

module.exports = router;
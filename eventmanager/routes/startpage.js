"use strict"
var express = require('express');
var routes = express.Router();
var path = require('path');

routes.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../public/views/startpage.html'));
});

module.exports = routes;
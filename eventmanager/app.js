"use strict"
var express = require('express');
var app = express();
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var fs = require('fs');
var settings = fs.readFileSync('./settings/settings.txt','utf8');
global.servSettings = JSON.parse(settings);
var port = servSettings.server.port;
/*-----------------------------------------*/
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('view engine', 'ejs');
app.use(session({
  secret: 'Answer to the Ultimate Question of Life, the Universe, and Everything: 42',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))
/*-----------------------------------------*/
global.Person = require('./modules/person');
global.Event = require('./modules/event');
global.DBConnection = require('./modules/mysqlConnection');
global.emailSender = require('./modules/emailSender');
/*-----------------------------------------*/
app.use(express.static('public'));

var startPage = require('./routes/startpage');
var startEvent = require('./routes/startevent');
var invitePage = require('./routes/invitepage');
var ownerPagePass = require('./routes/ownerpagepass');
var submitPage = require('./routes/submitpage');
var ownerPage = require('./routes/ownerpage');

app.use('/', startPage);
app.use('/startevent', startEvent);
app.use('/i', invitePage);
app.use('/o', ownerPagePass);
app.use('/s', submitPage);
app.use('/ownerpage', ownerPage);
/*-----------------------------------------*/
app.listen(port, function(){console.log('server started at port:'+port);});


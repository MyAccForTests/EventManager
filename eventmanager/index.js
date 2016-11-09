var express = require('express');
var app = express();
var port = 6560;

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));

var index = require('./routes/index');
var login = require('./routes/login');

app.use('/', index);
app.use('/login', login);

app.listen(port, function(){console.log("Server started at port:"+port);});
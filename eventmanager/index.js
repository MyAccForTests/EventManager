var express = require('express');
var app = express();
var port = 6560;
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var login = require('./routes/login');
app.use("/", login);


app.listen(port,started);
function started()
{
	console.log("Server started at port:"+port);
}
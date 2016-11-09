var express = require('express');
var app = express();
var port = 6560;

app.get("/", function (request, response) {
  response.send('Hello World!')
});

app.listen(port,started);

function started()
{
	console.log("Server started at port:"+port);
}
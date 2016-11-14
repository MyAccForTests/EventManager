"use strict"
var servAdress="http://localhost:6560";
window.addEventListener ("load", function()
{
	$("#buttonForm").attr("action",servAdress+"/startevent");
});
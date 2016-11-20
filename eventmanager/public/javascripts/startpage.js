"use strict"
var servAdress="http://localhost:6560";
$(window).on("load", function()
{
	$("#buttonForm").attr("action",servAdress+"/startevent");
});
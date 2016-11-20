"use strict"
var servAdress="http://localhost:6560/startevent";
$(window).on("load",function()
{
	var value=$("#invLnk").val();
	new QRCode(document.getElementById("qrcode"), 
	{
		text: value,
		width: 128,
		height: 128,
		colorDark : "#000000",
		colorLight : "#ffffff",
		correctLevel : QRCode.CorrectLevel.H
	});
	$("#invBut").click (function() {
		$("#invLnk").select();
		document.execCommand('copy');
	});
	$("#ownBut").click (function() {
		$("#ownLnk").select();
		document.execCommand('copy');
	});
	$("#invGoBut").click(function(){
		//console.log($("#invLnk").val());
		location.href=($("#invLnk").val());
	});
	$("#ownGoBut").click(function(){
		//console.log($("#ownLnk").val());
		location.href=($("#ownLnk").val());
	});
});
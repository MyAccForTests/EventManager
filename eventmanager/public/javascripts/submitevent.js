"use strict"
var servAdress="http://localhost:6560/startevent";
window.addEventListener("load",function()
{
	var value=document.getElementById("invLnk").value;
	new QRCode(document.getElementById("qrcode"), 
	{
    text: value,
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H,
	});
	
	document.querySelector("#invBut").onclick = function() {
	document.querySelector("#invLnk").select();
	document.execCommand('copy');
	};
	document.querySelector("#ownBut").onclick = function() {
	document.querySelector("#ownLnk").select();
	document.execCommand('copy');
	};
	$("#invGoBut").click(function(){
		//console.log($("#invLnk").val())
		location.href=$("#invLnk").val();
		});
	$("#ownGoBut").click(function(){
		//console.log($("#ownLnk").val())
		location.href=$("#ownLnk").val();
		});
});
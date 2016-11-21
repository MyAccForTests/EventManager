"use strict"
servAdress+="startevent";
$(window).on("load",function()
{
	var now=new Date();
	var min=new Date(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),0,0));
	var max=new Date(Date.UTC(now.getFullYear()+100,now.getMonth(),now.getDate(),now.getHours(),0,0));
	var tomorrow=new Date(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()+1,now.getHours(),0,0));
	$("#date").val(tomorrow.toISOString().slice(0,16));
	$("#datereg").val(tomorrow.toISOString().slice(0,16));
	$("#date").attr("min", min.toISOString().slice(0,16));
	$("#date").attr("max", max.toISOString().slice(0,16));
	$("#datereg").attr("min", min.toISOString().slice(0,16));
	$("#datereg").attr("max", max.toISOString().slice(0,16));
	symbCount();
	regDateSet();
	$("#eventForm").attr("action",servAdress+"/create");
});
function regDateSet()
{
	var evDate=$("#date").val();
	$("#datereg").attr("max", evDate);
}
function symbCount()
{
	var maxL=$("#description").attr("maxlength");
	var curL=$("#description").val().length;
	var symLeft=maxL-curL;
	$("#leftSym").text(symLeft+"/"+maxL);
}
function checkNameInBase()
{
	var email=$("#email").val();
	var data = 
	{
		url : servAdress+"/email",
		method : "POST",
		data :
		{
			name : "",
			email : email
		}
	}
	var post = $.ajax(data);
	post.done(function(user)
		{
			$("#name").val(user.name);
		});
}
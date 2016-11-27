"use strict"
servAdress+="i";
var userID;
var currLoc;
var ck = 
{
	userID	:	"",
	evID	:	""
}

$(window).on("load", function()
{
	var ck=Cookies.getJSON('ck');
	console.log(ck);
	currLoc = window.location.pathname.slice(1,window.location.pathname.length);
	if(ck===undefined||ck.userID=="")
	{
		$("#participate").on("click",participate);
		$("#submit").hide();
		$("#email").hide();
		$("#name").hide();
		$("#err").hide();
	}
	else
	{
		$("#err").hide();
		$("#participate").hide();
		$("#name").show();
		$("#email").show();
		$("#submit").show();
		$("#name").prop("readonly","true");
		$("#email").prop("readonly","true");
		var data = 
		{
			url : servAdress+"/user",
			method : "POST",
			data :
			{
				id	:	ck.userID
			}
		}
		var post = $.ajax(data);
		post.done(function(user)
		{
			$("#name").val(user.name);
			$("#email").val(user.email);
		});
		post.fail(function(user)
		{
			$("#errMessage").prop("innerHTML","Error loading user information");
			$("#err").show();
		});
		$("#submit").on("click",unsub);
		$("#submit").prop("innerHTML","Unsubscribe!")
	}
});

var participate=function()
{
	$("#participate").hide();
	$("#submit").show();
	$("#email").show();
	$("#submit").prop("innerHTML","Next");
	$("#submit").on("click",check);
	$("#participate").unbind("click",participate);
}
var check=function()
{
	$("#err").hide();
	var email=$("#email").val();
	if(email!="")
	{
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
			var name=user.name;
			$("#name").show();
			if(name!="")
			{
				$("#name").val(name);
				userID=user.id;
			}
			$("#email").prop("readonly","true");
			$("#submit").prop("innerHTML","Subscribe!")
			$("#submit").unbind("click",check);
			$("#submit").on("click",sub);
			
		});
		post.fail(function(user)
		{
			$("#errMessage").prop("innerHTML","Error checking email, try again later");
			$("#err").show();
		});
	}
}

var sub=function()
{
	$("#err").hide();
	var name=$("#name").val();
	var email=$("#email").val();
	if(name!="")
	{
		var dt;
		if(userID===undefined)
		{
			dt = 	{
						name	:	name,
						email 	: 	email,
						evID	:	evID
					}
		}
		else
		{
			dt = 	{
						userID 	:	userID,
						evID	:	evID
					}
		}
		var data = 
		{
			url : servAdress+"/sub",
			method : "POST",
			data :	dt
		}
		var post = $.ajax(data);
		post.done(function(resp)
		{
				$("#name").prop("readonly","true");
				$("#submit").unbind("click",sub);
				$("#submit").prop("innerHTML","Unsubscribe!")
				$("#submit").on("click",unsub);
				userID=(JSON.parse(resp)).userID;
				evID=(JSON.parse(resp)).evID;
				var ck = 
						{
							userID	:	userID,
							evID	:	evID
						}
				Cookies.set('ck', ck, { path: currLoc });
				console.log(Cookies.getJSON('ck'));
		});
		post.fail(function(user)
		{
			$("#errMessage").prop("innerHTML","Error during subscribing, try again later");
			$("#err").show();
		});
	}
}
var unsub=function()
{
	Cookies.remove('ck', { path: currLoc });
	/*
	var data = 
		{
			url : servAdress+"/sub",
			method : "POST",
			data :	{
						userID : userID,
						evID : evID
					}
		}
		var post = $.ajax(data);
		post.done(function(resp)
			{
				console.log(resp);
			});
		post.fail(function(resp)
			{
				console.log(resp);
			});
	*/
}
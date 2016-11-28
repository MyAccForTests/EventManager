"use strict"
servAdress+="i";
var userID;

$(window).on("load", function()
{	
	setFreeSpace();
	$("#err").hide();
	var ck=Cookies.getJSON('ck');
	if(ck===undefined||ck.userID=="")
	{	
		$("#email").hide();
		$("#name").hide();
		$("#submit").on("click",participate);
		$("#submit").prop("innerHTML","Participate");
		
	}
	else
	{
		userID=ck.userID;
		$("#err").hide();
		$("#name").show();
		$("#email").show();
		$("#name").prop("readonly","true");
		$("#email").prop("readonly","true");
		var data = 
		{
			url : servAdress+"/user",
			method : "POST",
			data :
			{
				id	:	userID
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
	$("#email").show();
	$("#submit").prop("innerHTML","Next");
	$("#submit").on("click",check);
	$("#submit").unbind("click",participate);
}
var check=function()
{
	$("#name").prop("readonly",false);
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
			$("#name").val("");
			if(name!="")
			{
				$("#name").val(name);
				userID=user.id;
			}
			$("#email").prop("readonly","true");
			$("#submit").prop("innerHTML","Subscribe!")
			$("#submit").unbind("click",check);
			$("#submit").on("click",sub);
			$("#err").hide();
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
	var name=$("#name").val();
	var email=$("#email").val();
	if(name!="")
	{
		var data = 
		{
			url : servAdress+"/sub",
			method : "POST",
			data :	
			{
				userID 	:	userID,
				evID	:	evID,
				name	:	name,
				email 	: 	email
			}
		}
		var post = $.ajax(data);
		post.done(function(resp)
		{
				if(resp=="no_space")
				{
					$("#errMessage").prop("innerHTML","There is no free space, sorry.");
					$("#err").show();
				}
				else
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
					Cookies.set('ck', ck, { path: window.location.pathname, expires: 356 });
					$("#err").hide();
				}
				setFreeSpace();
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
	var data = 
		{
			url : servAdress+"/unsub",
			method : "POST",
			data :	{
						userID : userID,
						evID : evID
					}
		}
	var post = $.ajax(data);
	post.done(function(resp)
		{
			Cookies.remove('ck', { path: window.location.pathname });
			$("#submit").unbind("click",unsub);
			$("#submit").on("click",participate);
			$("#submit").prop("innerHTML","Participate");
			$("#email").hide();
			$("#name").hide();
			$("#err").hide();
			$("#email").prop("readonly",false);
			setFreeSpace();
		});
	post.fail(function(resp)
		{
			$("#errMessage").prop("innerHTML","Error during unsubscribing, try again later");
			$("#err").show();
		});
}

var setFreeSpace = function(leftSpace)
{
	var data = 
		{
			url : servAdress+"/getfreespace",
			method : "POST",
			data :	{
						evID : evID
					}
		}
	var post = $.ajax(data);
	post.done(function(resp)
		{
			if(resp>=0)
			{
				$("#leftSpace").prop("innerHTML",resp);
			}
		});
}
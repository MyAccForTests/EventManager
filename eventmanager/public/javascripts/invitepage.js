"use strict"
servAdress+="i";
var userID;

$(window).on("load", function()
{	
	$('#description').html($('#description').html().replace(/&lt;br&gt;/g, '<br>'));
	$("#email").hide();
	$("#name").hide();
	$("#submit").prop("innerHTML","Participate");
	setFreeSpace();
	$("#err").hide();
	var ck=Cookies.getJSON('ck');
	if(ck===undefined||ck.userID=="")
	{	
		$("#submit").on("click",participate);
	}
	else
	{
		userID=ck.userID;
		$("#err").hide();
		var data = 
		{
			url : servAdress+"/user",
			method : "POST",
			data :
			{
				userID	:	userID,
				evID	:	evID
			}
		}
		var post = $.ajax(data);
		post.done(function(resp)
		{
			if(resp.isSubscribed)
			{
				$("#name").val(resp.user.name);
				$("#email").val(resp.user.email);
				$("#name").show();
				$("#email").show();
				$("#name").prop("readonly","true");
				$("#email").prop("readonly","true");
				$("#submit").on("click",unsub);
				$("#submit").prop("innerHTML","Unsubscribe!")
			}
			else
			{
				$("#submit").on("click",participate);
				Cookies.remove('ck', { path: window.location.pathname });
			}
		});
		post.fail(function(user)
		{
			$("#errMessage").prop("innerHTML","Error loading user information");
			$("#err").show();
		});
		
	}
});

var participate=function()
{	
	var nowDate=new Date();
	var dateReg=new Date($("#dateReg").prop("innerHTML"));
	if(nowDate>dateReg)
	{
		
		$("#errMessage").prop("innerHTML","Sorry, registration has ended");
		$("#err").show();
	}
	else
	{
		$("#email").show();
		$("#submit").prop("innerHTML","Next");
		$("#submit").on("click",check);
		$("#submit").unbind("click",participate);
	}
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
				evID	:	evID,
				email 	: 	email
			}
		}
		var post = $.ajax(data);
		post.done(function(resp)
		{
			var name=resp.user.name;
			$("#name").show();
			$("#name").val("");
			var wasSubscribed=resp.wasSubscribed;;
			if(wasSubscribed)
			{
				$("#name").val(name);
				$("#name").prop("readonly",true);
				userID=resp.user.id;
				var ck = 
						{
							userID	:	userID,
							evID	:	evID
						}
				Cookies.set('ck', ck, { path: window.location.pathname, expires: 356 });
				$("#submit").prop("innerHTML","Unsubscribe!")
				$("#submit").on("click",unsub);
				$("#errMessage").prop("innerHTML","You already subscribed, cookies restored");
				$("#err").show();
			}
			else
			{
				if(name!="")
				{
					$("#name").val(name);
					userID=resp.user.id;
				}
				$("#submit").prop("innerHTML","Subscribe!")
				$("#submit").on("click",sub);
				$("#err").hide();
			}
			$("#email").prop("readonly","true");
			$("#submit").unbind("click",check);
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
				dateReg :	$("#dateReg").prop("innerHTML"),
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
				else if(resp=="reg_closed")
				{
					$("#errMessage").prop("innerHTML","Sorry, registration has ended");
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
			userID="";
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
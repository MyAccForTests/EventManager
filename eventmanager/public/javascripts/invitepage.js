"use strict"
servAdress+="i";
var userID;

$(window).on("load", function()
{	
	$('#description').html($('#description').html().replace(/&lt;br&gt;/g, '<br>'));
	$("#email").hide();
	$("#pass").hide();
	$("#passNew").hide();
	$("#passHint").hide();
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
				evID	:	evID,
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
				$("#name").prop("readonly",true);
				$("#email").prop("readonly",true);
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
			$("#errMessage").prop("innerHTML","Server error, try again later!");
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
	$("#err").hide();
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
				email 	: 	email
			}
		}
		var post = $.ajax(data);
		post.done(function(resp)
		{
			$("#email").prop("readonly",true);
			if(resp.user.email!="")
			{
				$("#pass").show();
				$("#passNew").show();
				$("#passHint").show();
				$("#submit").unbind("click",check);
				$("#submit").on("click",checkPass);
			}
			else
			{
				$("#name").show();
				$("#name").val("");
				$("#submit").unbind("click",check);
				$("#submit").prop("innerHTML","Subscribe!")
				$("#submit").on("click",sub);
			}
		});
		post.fail(function(user)
		{
			$("#errMessage").prop("innerHTML","Server error, try again later!");
			$("#err").show();
		});
	}
}

var checkPass=function()
{
	$("#err").hide();
	var email=$("#email").val();
	var pass=$("#pass").val();
	var data = 
		{
			url : servAdress+"/checkpass",
			method : "POST",
			data :
			{
				evID	:	evID,
				pass	:	pass,
				email 	: 	email
			}
		}
		var post = $.ajax(data);
		post.done(function(resp)
		{
			if(resp.passCheck)
			{
				$("#pass").hide();
				$("#passNew").hide();
				$("#passHint").hide();
				$("#name").show();
				$("#name").val("");
				$("#email").prop("readonly",true);
				var name=resp.user.name;
				$("#name").val(name);
				userID=resp.user.id;
				var wasSubscribed=resp.wasSubscribed;
				if(wasSubscribed)
				{
					$("#name").prop("readonly",true);
					var ck = 
							{
								userID	:	userID,
								evID	:	evID,
								pass	:	pass
							}
					Cookies.set('ck', ck, { path: window.location.pathname, expires: 356 });
					$("#submit").prop("innerHTML","Unsubscribe!")
					$("#submit").on("click",unsub);
					$("#submit").unbind("click",checkPass);
					$("#errMessage").prop("innerHTML","You already subscribed, cookies restored");
					$("#err").show();
					$("#pass").val("");
				}
				else
				{
					$("#submit").prop("innerHTML","Subscribe!")
					$("#submit").on("click",sub);
					$("#submit").unbind("click",checkPass);
					$("#err").hide();
				}
			}
			else
			{
				$("#errMessage").prop("innerHTML","Wrong password");
				$("#err").show();
			}
		});
		post.fail(function(user)
		{
			$("#errMessage").prop("innerHTML","Server error, try again later!");
			$("#err").show();
		});
}

var sub=function()
{
	var name=$("#name").val();
	var email=$("#email").val();
	var pass=$("#pass").val();
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
				email 	: 	email,
				pass	:	pass
			}
		}
		var post = $.ajax(data);
		post.done(function(resp)
		{
				if(resp=="no_space")
				{
					$("#errMessage").prop("innerHTML","There is no free space, sorry");
					$("#err").show();
				}
				else if(resp=="reg_closed")
				{
					$("#errMessage").prop("innerHTML","Sorry, registration has ended");
					$("#err").show();
				}
				else if(resp=="wrong_pass")
				{
					$("#errMessage").prop("innerHTML","Wrong password");
					$("#err").show();
				}
				else
				{
					if((JSON.parse(resp)).pass!="")
					{
						pass=(JSON.parse(resp)).pass;
					}
					$("#name").prop("readonly",true);
					$("#submit").unbind("click",sub);
					$("#submit").prop("innerHTML","Unsubscribe!")
					$("#submit").on("click",unsub);
					userID=(JSON.parse(resp)).userID;
					evID=(JSON.parse(resp)).evID;
					var ck = 
						{
							userID	:	userID,
							evID	:	evID,
							pass	:	pass
						}
					Cookies.set('ck', ck, { path: window.location.pathname, expires: 356 });
					$("#err").hide();
					$("#pass").val("");
				}
				setFreeSpace();
		});
		post.fail(function(user)
		{
			$("#errMessage").prop("innerHTML","Server error, try again later!");
			$("#err").show();
		});
	}
}
var unsub=function()
{
	$("#err").hide();
	if($("#pass").is(":visible"))
	{
		var data = 
			{
				url : servAdress+"/unsub",
				method : "POST",
				data :	{
							userID		:	userID,
							evID	 	: 	evID,
							pass		:	$("#pass").val()
						}
			}
		var post = $.ajax(data);
		post.done(function(resp)
			{
				if(resp=="wrong_pass")
					{
						$("#errMessage").prop("innerHTML","Wrong password");
						$("#err").show();
					}
					else
					{
						$("#submit").unbind("click",unsub);
						$("#submit").on("click",participate);
						$("#submit").prop("innerHTML","Participate");
						$("#email").hide();
						$("#name").hide();
						$("#err").hide();
						$("#email").prop("readonly",false);
						setFreeSpace();
						userID="";
						$("#pass").hide();
						$("#pass").val("");
						Cookies.remove('ck', { path: window.location.pathname });
					}
				
			});
		post.fail(function(resp)
			{
				$("#errMessage").prop("innerHTML","Server error, try again later!");
				$("#err").show();
			});
	}
	else
	{
		$("#pass").show();
	}
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

var newPassword=function()
{
	$("#err").hide();
	var data = 
	{
		url : servAdress+"/newpass",
		method : "POST",
		data :
		{
			email 	: 	$("#email").val(),
		}
	}
	var post = $.ajax(data);
	post.done(function(resp)
	{
		$("#err").show();
		$("#errMessage").prop('innerHTML','New password was send to your email');
	});
	post.fail(function(err)
	{
		$("#err").show();
		$("#errMessage").prop('innerHTML','Server error, try again later!');
	});
}
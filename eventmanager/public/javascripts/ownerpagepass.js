"use strict"
servAdress+="o";
var email;
$(window).on("load",function()
{
	email=$("#email").val();
	$("#err").hide();
	$("#submit").on("click",login);
});

var login= function()
{
	var data = 
		{
			url : servAdress+"/login",
			method : "POST",
			data :
			{
				userID	:	userID,
				evID	:	evID,
				pass	:	$("#pass").val()
			}
		}
		var post = $.ajax(data);
		post.done(function(resp)
		{
			console.log(resp);
			if(resp=="wrong_data")
			{
				$("#errMessage").prop("innerHTML","Wrong login data, please reload page");
				$("#err").show();
			}
			else if(resp=="wrong_pass")
			{
				$("#errMessage").prop("innerHTML","Wrong password");
				$("#err").show();
			}
			else 
			{
				$("#errMessage").prop("innerHTML","Success");
				$("#err").show();
			}
		});
		post.fail(function(resp)
		{
			console.log(resp);
			$("#errMessage").prop("innerHTML","Server error, try again later!");
			$("#err").show();
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
			email 	: 	email,
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
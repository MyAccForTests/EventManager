"use strict"
servAdress+="i";
$(window).on("load", function()
{
	$("#participate").on("click",participate);
	$("#submit").hide();
	$("#email").hide();
	$("#name").hide();
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
			if(name=="")
			{
				$("#name").show();
				$("#submit").unbind("click",check);
				$("#submit").on("click",writeUser);
			}
			else
			{
				$("#name").show();
				$("#name").val(name);
				$("#name").prop("readonly","true");
				$("#submit").prop("innerHTML","Subscribe!")
				$("#submit").unbind("click",check);
				$("#submit").unbind("click",writeUser);
				$("#submit").on("click",sub);
			}
			$("#email").prop("readonly","true");
			
		});
	}
}

var writeUser = function()
{
	
}

var sub=function()
{
	$("#name").prop("readonly","true");
	$("#submit").unbind("click",sub);
	$("#submit").prop("innerHTML","Unsubscribe!")
	$("#submit").on("click",unsub);
}
var unsub=function()
{
	console.log("unsubscribed");
}
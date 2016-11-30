"use strict"
servAdress+="startevent";
$(window).on("load",function()
{
	$(".pass").hide();
	$("#err").hide();
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
	$('#eventForm').submit(prepare);
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
	$("#err").hide();
	$(".pass").hide();
	$("#pass").removeAttr('required');
	$("#pass").val("");
	$("#name").val("");
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
			if(user.name!="")
			{
				$("#name").val(user.name);
				$(".pass").show();
				$("#pass").prop('required',true);
			}
		});
	post.fail(function(err)
	{
		$("#err").show();
		$("#errMessage").prop('innerHTML','Server error, try again later!');
	});
}

var prepare = function()
{
	var pass;
	if($('.pass').is(":visible"))
	{
		pass = $("#pass").val()
	}
	else
	{
		pass = "";
	}
	$("#err").hide();
	var data = 
	{
		url : servAdress+"/checkpass",
		method : "POST",
		data :
		{
			email 	: 	$("#email").val(),
			pass	:	pass
		}
	}
	var post = $.ajax(data);
	post.done(function(resp)
	{
		if(resp)
		{
			$('#description').val().replace(/\n/g, '<br>');
			$('#eventForm').unbind('submit',prepare);
			$('#eventForm').submit();
		}
		else
		{
			$("#err").show();
			$("#errMessage").prop('innerHTML','Wrong password!');
		}
	});
	post.fail(function(err)
	{
		$("#err").show();
		$("#errMessage").prop('innerHTML','Server error, try again later!');
	});
	return false;
}

var newPassword=function()
{
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
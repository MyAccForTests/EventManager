"use strict"
servAdress+="ownerpage";
$(window).on("load",function()
{
	$("#exit").on("click",exit);
});

var exit = function()
{
	var data = 
		{
			url : servAdress+"/exit",
			method : "GET",
		}
		var get = $.ajax(data);
	get.success()
	{
		 location.reload();
	}
	get.success()
	{
		console.log("server error");
	}
}
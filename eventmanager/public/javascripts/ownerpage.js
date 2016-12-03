"use strict"
servAdress+="ownerpage";
$(window).on("load",function()
{
	$("#exit").on("click",exit);
	$("#subscribers").on("click",setClicked);
	$("#manageEvent").on("click",setClicked);
	
});

var app=angular.module('ownerpage',["ngRoute"]);

app.config(function ($routeProvider) {

$routeProvider
.when('/subscribers', {
    templateUrl :'../views/ownerpagesubsribers.html',
    controller : 'subscribersController'

})

.when('/manageevent',{
    templateUrl : '../views/ownerpagemanageevent.html',
    controller : 'manageEventController'
})


});

app.controller("nameController",function($scope, $http) {
	$http({
		method: "GET",
		url: servAdress+"/name"
	})
	.then(function(response) {
		$("#err").hide();
		$scope.name = "Hello, " + response.data;
	},
	function(err) {
		$("#errMessage").prop("innerHTML","Server error, try again later!");
		$("#err").show();
	});
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
var setClicked = function()
{
	$("#mainPills").children().removeClass("active");
	$(this).addClass("active");
}
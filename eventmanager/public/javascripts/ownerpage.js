"use strict"
servAdress+="ownerpage";
$(window).on("load",function()
{
	
	$("#exit").on("click",exit);
	//$("#subscribers").on("click",setClicked);
	//$("#manageEvent").on("click",setClicked);
	$('.fc-button-prev span').click( function() {
	checkClicked();
	});

	$('.fc-button-prev span').click(function() {
	checkClicked();
	});
});



var app=angular.module('ownerpage',['ngRoute']);

app.config(['$routeProvider', '$locationProvider',function ($routeProvider, $locationProvider) {

$locationProvider.html5Mode({
	enabled: true,
	requireBase: false
})

$routeProvider
.when('/subscribers', {
    templateUrl :'../views/ownerpagesubsribers.html',
    controller : 'subscribersController'

})

.when('/manageevent',{
    templateUrl : '../views/ownerpagemanageevent.html',
    controller : 'manageEventController'
})


}]);

app.controller("nameController",['$scope', '$http',function($scope, $http) {
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
}]);

app.controller("manageEventController",['$scope', '$http',function($scope, $http) {
	checkClicked();
	$http({
		method: "POST",
		url: servAdress+"/getevent"
	})
	.then(function(response) {
		$("#err").hide();
		$scope.title=response.data.title;
		$scope.description=response.data.description;
		$scope.email=response.data.email;
		$scope.name=response.data.name;
		$scope.date=response.data.date.substring(0,response.data.date.length-5);
		$scope.datereg=response.data.date.substring(0,response.data.date.length-5);
		if(response.data.img==null)
		{
			$scope.img='../images/eventInviteImagePlaceholder.png';
		}
		else
		{
			$scope.img="../"+response.data.img.replace('\public','/').replace("\\",'/');
		}
		if(response.data.capacity==null)
		{
			$scope.capacity='';
		}
		else
		{
			$scope.capacity=response.data.capacity;
		}
		if(response.data.price==null)
		{
			$scope.price=response.data.price;
		}
		else
		{
			$scope.price=response.data.price;
		}
	},
	function(err) {
		$("#errMessage").prop("innerHTML","Server error, try again later!");
		$("#err").show();
	});
}]);

app.controller("subscribersController",['$scope', '$http',function($scope, $http) {
	
	checkClicked();
	
}]);
	
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
/*
var setClicked = function()
{
	$("#mainPills").children().removeClass("active");
	$(this).addClass("active");
}
*/
var checkClicked = function()
{
	$("#mainPills").children().removeClass("active");
	if(window.location.pathname=="/subscribers")
	{
		$("#subscribers").addClass("active");
	}
	if(window.location.pathname=="/manageevent")
	{
		$("#manageEvent").addClass("active");
	}
}

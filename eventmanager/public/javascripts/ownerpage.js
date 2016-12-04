"use strict"
servAdress+="ownerpage";
$(window).on("load",function()
{
	$("#exit").on("click",exit);
	$('.fc-button-prev span').click(checkClicked());
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
	var now=new Date();
	var min=new Date(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),0,0));
	var max=new Date(Date.UTC(now.getFullYear()+100,now.getMonth(),now.getDate(),now.getHours(),0,0));
	$("#date").attr("min", min.toISOString().slice(0,16));
	$("#date").attr("max", max.toISOString().slice(0,16));
	$("#datereg").attr("min", min.toISOString().slice(0,16));
	$("#datereg").attr("max", max.toISOString().slice(0,16));
	$http({
		method: "POST",
		url: servAdress+"/getevent"
	})
	.then(function(response) {
		$("#err").hide();
		$scope.title=response.data.title;
		$scope.description=response.data.description.replace(new RegExp('<br>', 'g'), '\n');
		$scope.email=response.data.email;
		$scope.name=response.data.name;
		$scope.date=response.data.date.substring(0,response.data.date.length-5);
		$scope.datereg=response.data.date.substring(0,response.data.date.length-5);
		$scope.modify=function()
		{
			console.log("rr");
		/*	
			$("#err").hide();
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
		*/
		}
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
		symbCount();
		regDateSet();
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

var symbCount=function()
{
	var maxL=$("#description").attr("maxlength");
	var curL=$("#description").val().length;
	var symLeft=maxL-curL;
	$("#leftSym").text(symLeft+"/"+maxL);
}

var regDateSet=function()
{
	var evDate=$("#date").val();
	$("#datereg").attr("max", evDate);
}
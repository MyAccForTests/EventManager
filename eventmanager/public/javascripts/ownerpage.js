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
	$("#manageeventRow").hide();
	changeBar(10, true);
	checkClicked();
	$("#err").hide();
	var now=new Date();
	var min=new Date(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),0,0));
	var max=new Date(Date.UTC(now.getFullYear()+100,now.getMonth(),now.getDate(),now.getHours(),0,0));
	$("#date").attr("min", min.toISOString().slice(0,16));
	$("#date").attr("max", max.toISOString().slice(0,16));
	$("#datereg").attr("min", min.toISOString().slice(0,16));
	$("#datereg").attr("max", max.toISOString().slice(0,16));
	$scope.ev={};
	changeBar(70, true);
	$http({
		method: "POST",
		url: servAdress+"/getevent"
	})
	.then(function(response) {
		changeBar(80, true);
		$("#err").hide();
		parseEvent($scope, response);
		symbCount();
		regDateSet();
		changeBar(100, true);
		$("#manageeventRow").show();
		changeBar(0, false);
		$scope.modify=function()
		{
			$("#manageeventRow").hide();
			changeBar(10, true);
			$("#err").hide();
			var formData = new FormData();
			var scdesc=$scope.ev.description.replace(new RegExp('\n', 'g'), '<br>');
			var data =	{
							title		:	$scope.ev.title==response.data.title?"":$scope.ev.title,
							description	:	scdesc==response.data.description?"":scdesc,
							name		:	$scope.ev.name==response.data.name?"":$scope.ev.name,
							email		:	$scope.ev.email,
							date		:	$scope.ev.date.toISOString(),
							datereg		:	$scope.ev.datereg.toISOString(),
							capacity	:	$scope.ev.capacity==response.data.capacity?"":$scope.ev.capacity,
							price		:	$scope.ev.price==response.data.price?"":$scope.ev.price,
						}
			var img=$('#imgload')[0].files[0];
			if(img!==undefined)
			{
				formData.append('file', img);
			}
			formData.append('data', JSON.stringify(data));
			changeBar(70, true);
			var post=$.ajax({
				url: servAdress+"/updateevent",
				data: formData,
				type: 'POST',
				contentType: false,
				processData: false
			})
			post.done(function(response)
			{
				changeBar(100, true);
				if(response=="capacity_limit")
				{
					$("#errMessage").prop("innerHTML","Unable to update, capacity reached, first unsubscribe users");
					$("#err").show();
				}
				else
				{
					response.data=response;
					parseEvent($scope, response);
					$scope.$apply();
					$("#errMessage").prop("innerHTML","Successfully updated!");
					$("#err").show();
				}
				$("#manageeventRow").show();
				changeBar(0, false);
			});
			post.fail(function(response)
			{
				$("#errMessage").prop("innerHTML","Server error, try again later!");
				$("#err").show();
				changeBar(0, false);
			});
		}
	},
	function(err) {
		$("#errMessage").prop("innerHTML","Server error, try again later!");
		$("#err").show();
		changeBar(0, false);
	});
}]);

app.controller("subscribersController",['$scope', '$http',function($scope, $http) {
	changeBar(10, true);
	checkClicked();
	$("#subscribersRow").hide();
	$("#err").hide();
	changeBar(70, true);
	$http({
		method: "POST",
		url: servAdress+"/getsubscribers"
	})
	.then(function(response) {
		changeBar(100, true);
		$("#err").hide();
		$scope.subsArray=response.data;
		$("#subscribersRow").show();
		changeBar(0, false);
		$scope.unsubscribe=function(userID, index)
		{
			changeBar(0, true);
			$http({
				method: "POST",
				url: servAdress+"/unsubscribeuser",
				data : {userID	:	userID}
			})
			.then(function(response) {
				changeBar(100, true);
				if(response=="capacity_limit")
				{
					$("#errMessage").prop("innerHTML","Unable to update, capacity reached, first unsubscribe users");
					$("#err").show();
				}
				else
				{
					$("#errMessage").prop("innerHTML","User was unsubscribed!");
					$("#err").show();
					$scope.subsArray.splice(index, 1);
				}
				changeBar(0, false);
			},
			function(err) {
				$("#errMessage").prop("innerHTML","Server error, try again later!");
				$("#err").show();
				changeBar(0, false);
			});
		}
	},
	function(err) {
		$("#errMessage").prop("innerHTML","Server error, try again later!");
		$("#err").show();
		changeBar(0, false);
	});
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

var parseEvent=function($scope, response)
{
	$scope.ev.title=response.data.title;
	$scope.ev.description=response.data.description.replace(new RegExp('<br>', 'g'), '\n');
	$scope.ev.email=response.data.email;
	$scope.ev.name=response.data.name;
	$scope.ev.date=new Date(response.data.date);
	$scope.ev.datereg=new Date(response.data.datereg);
	$scope.ev.img=response.data.img==null?"../images/eventInviteImagePlaceholder.png":"../"+response.data.img.replace('\public','/').replace('\\','/');
	$scope.ev.capacity=response.data.capacity==null?"":response.data.capacity;
	$scope.ev.price=response.data.price==null?"":response.data.price;
}

var changeBar = function(percent, show)
{
	if(show===undefined||show==true)
	{
		$("#progress").show();
	}
	else if(show==false)
	{
		$("#progress").hide();
	}
	$("#progBar").css("width",percent+"%");
}
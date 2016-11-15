"use strict"
var servAdress="http://localhost:6560/startevent";
window.addEventListener("load",function()
{
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
	regDateSet()
	$("#eventForm").attr("action",servAdress+"/create");
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
	var email=$("#email").val();
	var user=new Person("", email);
	var req=JSON.stringify(user);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", servAdress+"/email", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4 && xhr.status == 200) {
			var user=new Person(JSON.parse(xhr.responseText).name, JSON.parse(xhr.responseText).email);
			if(user.email!=""&&user.name!="")
			{
				$("#name").val(user.name);
			}
		};
	};
	xhr.send(req);
}
/*-----------------------------------------*/
class Person
{
	constructor(name, email)
	{
		this.name=name;
		this.email=email;
	}
}
class Event
{
	constructor(title, pass, description, owner, capacity, price, date, datereg, ownlnk, lnk, img)
	{
		this.title=title;
		this.pass=pass;
		this.description=description;
		this.owner=owner;
		this.capacity=capacity;
		this.price=price;
		this.date=date;
		this.datereg=datereg;
		this.ownlnk=ownlnk;
		this.lnk=lnk;
		this.img=img;
	}
}
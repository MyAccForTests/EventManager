"use strict"
window.addEventListener("load",function()
{
	var now=new Date();
	var tomorrow=now.getFullYear()+"-"+(now.getMonth()+1)+"-"+(now.getDate()+1)+"T"+now.getHours()+":00"+":00";
	var min=now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"T"+(now.getHours()-1)+":00"+":00";
	var max=(now.getFullYear()+100)+"-"+(now.getMonth()+1)+"-"+now.getDate()+"T"+now.getHours()+":00"+":00";
	$("#date").val(tomorrow);
	$("#datereg").val(tomorrow);
	$("#date").attr("min", min);
	$("#date").attr("max", max);
	$("#datereg").attr("min", min);
	$("#datereg").attr("max", max);
	symbCount();
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
	
}
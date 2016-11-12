"use strict"
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
module.exports = Event;
"use strict"
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(servSettings.mail);

var mailData = {
    from: servSettings.mail.auth.user,
    to: 'receiver@sender.com',
    subject: 'From Event Manager'
};

var notifyEventCreation = function(ev)
{
	console.log(ev)
	
	mailData.to=ev.owner.email;
	mailData.text='Hello.\n\nCongratulations, your event was successfully created. You can invite guests via link: \n\n'+servSettings.server.address+ev.lnk+'\n\nYou can manage your event via link: \n\n'+servSettings.server.address+ev.ownlnk+'\n\nusing password: \n\n'+ev.owner.pass+'\n\n';
	transporter.sendMail(mailData,function(err)
	{
		if(err){console.log('Error during mail sending '+err);}
		else{console.log('email to owner successfully sended');}
	});
}

var notifyEventUpdate = function(ev)
{
	console.log(ev)
	
	mailData.to=ev.owner.email;
	mailData.text='Hello.\n\nCongratulations, your event was successfully updated. You can invite guests via link: \n\n'+servSettings.server.address+ev.lnk+'\n\nYou can manage your event via link: \n\n'+servSettings.server.address+ev.ownlnk+'\n\nusing password: \n\n'+ev.owner.pass+'\n\n';
	transporter.sendMail(mailData,function(err)
	{
		if(err){console.log('Error during mail sending '+err);}
		else{console.log('email to owner successfully sended');}
	});
}

var notifyNewPass = function(user)
{
	console.log(user)
	
	mailData.to=user.email;
	mailData.text='Hello.\n\nYour password was reseted\n\nYour new password: \n\n'+user.pass+'\n\n';
	transporter.sendMail(mailData,function(err)
	{
		if(err){console.log('Error during mail sending '+err);}
		else{console.log('email to owner successfully sended');}
	});
}

var notifySubsc = function(user)
{
	console.log(user)
	
	mailData.to=user.email;
	mailData.text='Hello.\n\nYou have been successfully Subscribed to an event.';
	transporter.sendMail(mailData,function(err)
	{
		if(err){console.log('Error during mail sending '+err);}
		else{console.log('email to owner successfully sended');}
	});
}

var notifyUnsubsc = function(user)
{
	console.log(user)
	
	mailData.to=user.email;
	mailData.text='Hello.\n\nYou have been successfully Unsubscribed from an event.';
	transporter.sendMail(mailData,function(err)
	{
		if(err){console.log('Error during mail sending '+err);}
		else{console.log('email to owner successfully sended');}
	});
}

var notifyUnsubscByOwner = function(user)
{
	console.log(user)
	
	mailData.to=user.email;
	mailData.text='Hello.\n\nYou have been unsubscrubed from event by owner.';
	transporter.sendMail(mailData,function(err)
	{
		if(err){console.log('Error during mail sending '+err);}
		else{console.log('email to owner successfully sended');}
	});
}

module.exports.notifyEventCreation = notifyEventCreation;
module.exports.notifyEventUpdate = notifyEventUpdate;
module.exports.notifyNewPass = notifyNewPass;
module.exports.notifySubsc = notifySubsc;
module.exports.notifyUnsubsc = notifyUnsubsc;
module.exports.notifyUnsubscByOwner = notifyUnsubscByOwner;
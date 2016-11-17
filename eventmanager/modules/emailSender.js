"use strict"
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(servSettings.mail);

var mailData = {
    from: 'event_notifier@mail.ru',
    to: 'receiver@sender.com',
    subject: 'Your event was created!'
};

var sendPassNotification = function(ev)
{
	mailData.to=ev.owner.email;
	mailData.text='Hello.\n\nCongratulations, your event was successfully created. You can invite guests via link: \n\n '+servSettings.server.address+ev.lnk+'\n\nYou can manage your event via link: \n\n'+servSettings.server.address+ev.ownlnk+'\n\nusing password: \n\n'+ev.pass+'\n\n';
	transporter.sendMail(mailData,function(err)
	{
		if(err){console.log('Error during mail sending '+err);}
		else{console.log('email to owner successfully sended');}
	});
}

var sendInvNotification = function(ev)
{
	
}

module.exports.sendPassNotification = sendPassNotification;
module.exports.sendInvNotification = sendInvNotification;
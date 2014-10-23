/*

Javascript Plugged.in addon
© 2014 itotallyrock.tk

Modifying the source code of this file for personal use is allowed,
however redistributing of this product modified or not is disallowed.

Some of the features you have from using this addon may be frowned upon by certain communities, use responsibly.

Version 0.00.1 ALPHA

*/

var pluggedIn = {};
pluggedIn.core = {};
pluggedIn.settings = {};

pluggedIn.VERSION = "0.00.2 ALPHA";
pluggedIn.AUTHOR = "R0CK";

/*

	Core functionality

*/

//Define settings if unknown
if(/*Get Cookie Here*/true){
	pluggedIn.settings.autoWoot=true;
	pluggedIn.settings.autoDJ=true;
	pluggedIn.settings.spamDJ=false;
}

pluggedIn.core.autoWoot = (function(){
	$("#woot").click();
	API.on(API.ADVANCE,function(){$("#woot").click();});
});

pluggedIn.core.autoDJ = function(){
	if(API.getWaitListPosition() == -1){
		;
	}
}

pluggedIn.core.spamDJ = (function(){
	if(pluggedIn.settings.spamDJ){
		while(API.getTimeRemaining()<5){
			if(API.getWaitListPosition() == -1){
				$("#dj-button").click();
			}else{
				break;
			}
		}
	}
});

pluggedIn.core.appendchat = (function(message,color){
	if(!message){
		return false;
	}else{
		var a=$("#chat-messages");
		var time;
		d=new Date();
		var hours=d.getHours();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours=hours%12;
		var minutes=d.getMinutes();
		if(minutes<10){
			minutes='0'+minutes;
		}
		time=hours+':'+minutes;
		a.append('<div class="message"><div class="timestamp" style="display: block;">'+time+'</div><span class="from you clickable">Plug.in</span><div class="text" style="color:#' + (color ? color : 'd1d1d1') + ';display:inline;">&nbsp;' + message + '</div></div>');
	}
});

pluggedIn.core.initialize = (function(){
	console.log("pluggedIn version "+pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.");
	pluggedIn.core.appendChat("pluggedIn version "+pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.","8800ff");
	
	(pluggedIn.settings.autoDJ ? (pluggedIn.core.autoWoot();) : (return false;));
	(pluggedIn.settings.autoWoot ? (pluggedIn.core.autoWoot();) : (return false;));
	(pluggedIn.settings.spamDJ ? (pluggedIn.core.autoWoot();) : (return false;));
});

/*

	GUI and initialization

*/

pluggedIn.core.initialize(pluggedIn.settings.autoWoot);

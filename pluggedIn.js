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
pluggedIn.keyboard = {};

pluggedIn.VERSION = "0.00.2 ALPHA";
pluggedIn.AUTHOR = "R0CK";

pluggedIn.PREFIX = "PluggedIn » ";

pluggedIn.keyboard.SPAM_DJ = 86;

/*

	Core functionality

*/

//Define settings if unknown
if(/*Get Cookie Here*/true){
	pluggedIn.settings.autoWoot=true;
	pluggedIn.settings.autoDJ=true;
	pluggedIn.settings.spamDJ=false;
	pluggedIn.settings.debug=true;
}

pluggedIn.core.log = (function(msg){
	if(pluggedIn.settings.debug)
		console.log("%c"+pluggedIn.PREFIX+msg,'color: #8800ff; font-weight:700;');
});

pluggedIn.core.autoWoot = (function(){
	$("#woot").click();
	API.on(API.ADVANCE,function(){$("#woot").click();});
});

pluggedIn.core.autoDJ = function(){
	if(API.getWaitListPosition() == -1){
		API.on(API.ADVANCE,function(){$("#dj-button").click();});
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

pluggedIn.core.appendChat = (function(message,color){
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
		a.append('<div class="message"><div class="timestamp" style="display: block;">'+time+'</div><span class="from you clickable">pluggedIn</span><div class="text" style="font-weight:700;color:#' + (color ? color : 'd1d1d1') + ';display:inline;">&nbsp;' + message + '</div></div>');
	}
});



/*

KEYBOARD SHORTCUTS

*/

$(this).keydown(function (e) {
	if(e.which == pluggedIn.keyboard.SPAM_DJ){
		if(API.getWaitListPosition() == -1){
			$("#dj-button").click();
		}
	}
}).keyup(function(e) {
	var r = true;
	if(r){
		pluggedIn.core.log(pluggedIn.PREFIX+"Finalized Keyboard Shortcut Execution");
		r = false;
	}
});



pluggedIn.core.initialize = (function(){
	pluggedIn.core.log("pluggedIn version "+pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.");
	pluggedIn.core.appendChat("pluggedIn version "+pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.","8800ff");
	
	if(pluggedIn.settings.autoDJ){
		pluggedIn.core.autoDJ();
	}
	if(pluggedIn.settings.autWoot){
		pluggedIn.core.autoWoot();
	}
	if(pluggedIn.settings.spamDJ){
		pluggedIn.core.spamDJ();
	}
});


/*

	GUI and initialization

*/

pluggedIn.core.initialize();

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
pluggedIn.colors = {};

pluggedIn.VERSION = "v0.00.2-A";
pluggedIn.AUTHOR = "R0CK";

pluggedIn.PREFIX = "PluggedIn » ";

pluggedIn.LANGS = ["en"];

pluggedIn.keyboard.SPAM_DJ = 86;

pluggedIn.colors.WARN = "bb0000";
pluggedIn.colors.ALERT = "ffee00";
pluggedIn.colors.SUCCESS = "55bb00";
pluggedIn.colors.INFO = "009cdd";
pluggedIn.colors.DEFAULT = "ac76ff";

/*

	Core functionality

*/

//Define settings if unknown
if(/*Get Cookie Here*/true){
	pluggedIn.settings.autoWoot=true;
	pluggedIn.settings.autoDJ=true;
	pluggedIn.settings.spamDJ=false;
	pluggedIn.settings.debug=true;
	pluggedIn.settings.lang=0;
}

pluggedIn.core.log = (function(msg,debug){
	if(debug){//Will only display if debug enabled
		if(pluggedIn.settings.debug){
			console.log("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.DEFAULT+'; font-weight:700;');
		}
	}else{
		console.log("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.DEFAULT+'; font-weight:700;');
	}
});

pluggedIn.core.warn = (function(msg,debug){
	if(debug){//Will only display if debug enabled
		if(pluggedIn.settings.debug){
			console.log("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.WARN+'; font-weight:700;');
		}
	}else{
		console.log("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.WARN+'; font-weight:700;');
	}
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

pluggedIn.gui.appendChat = (function(message,color){
	if(!message){
		return false;
	}else{
		if(!color){
			$("#chat-messages").append('<div class="welcome"><span class="text" style="font-weight:800;">&nbsp;' + message + '</span></div>');
		}else{
			$("#chat-messages").append('<div class="welcome" style="border-left: #'+color+' 3px solid;color: #'+color+';"><span class="text" style="font-weight:800;">&nbsp;' + message + '</span></div>');
		}
		
		$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
	}
});



/*

KEYBOARD SHORTCUTS

*/

$(this).keydown(function (e) {
	if(e.which == pluggedIn.keyboard.SPAM_DJ){
		if(API.getWaitListPosition() == -1){
			if(API.getWaitList().length<50){
				$("#dj-button").click();
			}
		}
	}
}).keyup(function(e) {
	var r = true;
	if(r){
		pluggedIn.core.log("Finalized Keyboard Shortcut Execution",true);
		r = false;
	}
});



pluggedIn.core.initialize = (function(){
	pluggedIn.core.log("pluggedIn "+pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.");
	pluggedIn.gui.appendChat("pluggedIn "+pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.",pluggedIn.colors.INFO);
	
	if(pluggedIn.settings.autoDJ){
		pluggedIn.core.autoDJ();
	}
	if(pluggedIn.settings.autoWoot){
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

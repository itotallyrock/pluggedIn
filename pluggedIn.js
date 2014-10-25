/*

Javascript Plugged.in addon
© 2014 itotallyrock.tk

Modifying the source code of this file for personal use is allowed,
however redistributing of this product modified or not is disallowed.

Some of the features you have from using this addon may be frowned upon by certain communities, use responsibly.

Version 0.00.3 ALPHA

*/

var pluggedIn = {};
pluggedIn.core = {};
pluggedIn.gui = {};
pluggedIn.settings = {};
pluggedIn.keyboard = {};
pluggedIn.colors = {};

pluggedIn.VERSION = "v0.00.3-A";
pluggedIn.AUTHOR = "R0CK";

pluggedIn.PREFIX = "PluggedIn » ";

pluggedIn.LANGS = ["en"];

pluggedIn.keyboard.SPAM_DJ = 86;

pluggedIn.colors.WARN = "bb0000";
pluggedIn.colors.ALERT = "ffee00";
pluggedIn.colors.SUCCESS = "55bb00";
pluggedIn.colors.INFO = "009cdd";
pluggedIn.colors.DEFAULT = "ac76ff";


//Import external scripts

//$.getScript();



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



/*

CUSTOM ENCODING (Simple string to hex)

*/

pluggedIn.core.convertToHex = (function(str){
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
});

pluggedIn.core.convertFromHex = (function(hex){
    var hex = hex.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
});






pluggedIn.core.createCookie = (function(name,value,days){
	if (days){
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}else{
		var expires = "";
	}
	document.cookie = name+"="+value+expires+"; path=/";
});

pluggedIn.core.readCookie = (function (name){
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++){
		var c = ca[i];
		while(c.charAt(0)==' '){
			c = c.substring(1,c.length);
		}
		if(c.indexOf(nameEQ) == 0){
			return c.substring(nameEQ.length,c.length);
		}
	}
	return null;
});

pluggedIn.core.eraseCookie = (function(name){
	pluggedIn.core.createCookie(name,"",-1);
});


pluggedIn.core.getCookies = function(){
	var pairs = document.cookie.split(";");
	var cookies = {};
	for (var i=0; i<pairs.length; i++){
		var pair = pairs[i].split("=");
		cookies[pair[0]] = unescape(pair[1]);
	}
	return cookies;
}

pluggedIn.core.getSettings = (function(){
	if(pluggedIn.core.readCookie("pluggedIn")!=null){
		var c = pluggedIn.core.readCookie("pluggedIn");
		c = parseJSON(convertFromHex(c));
		
		pluggedIn.settings.autoWoot = c.settings.autoWoot;
		pluggedIn.settings.autoDJ = c.settings.autoDJ;
		pluggedIn.settings.spamDJ = c.settings.spamDJ;
		pluggedIn.settings.debug = c.settings.debug;
		pluggedIn.settings.lang = c.settings.land;
	}else{
		saveSettings();
	}
});

pluggedIn.core.saveSettings = (function(){
	pluggedIn.core.createCookie("pluggedIn",pluggedIn.core.convertToHex(JSON.stringify(pluggedIn.settings)),365);
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

pluggedIn.core.initialize();

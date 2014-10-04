/*

Javascript Plugged.in addon
© 2014 itotallyrock.tk

Modifying the source code of this file for personal use is allowed,
however redistributing of this product modified or not is disallowed.

Some of the features you have from using this addon may be frowned upon by certain communities, use responsibly.

Version 0.00.1 ALPHA

*/

var pluggedIn = {},pluggedIn.core={},pluggedIn.settings={};

final pluggedIn.VERSION = "0.00.1 ALPHA";
final pluggedIn.AUTHOR = "itotallyrock (R0CK)";

/*

	Core functionality

*/

//Define settings if unknown
if(/*Get Cookie Here*/true){
	pluggedIn.settings.autoWoot=false;
	pluggedIn.settings.autoDJ=false;
	pluggedIn.settings.spamDJ=false;
}

pluggedIn.core.autoWoot = function(){
	$("#woot").click();
	API.on(API.ADVANCE,function(){$("#woot").click();});
}

pluggedIn.core.autoDJ = function(){
	if(API.getWaitListPosition() == -1){
		;
	}
}

pluggedIn.core.spamDJ = function(){
	if(pluggedIn.settings.spamDJ){
		while(API.getTimeRemaining()<5){
			if(API.getWaitListPosition() == -1){
				$("#dj-button").click();
			}else{
				break;
			}
		}
	}
}

pluggedIn.core.initialize = function(){
	console.log("pluggedIn version "+pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.");
}

/*

	GUI and initialization

*/

pluggedIn.core.initialize();

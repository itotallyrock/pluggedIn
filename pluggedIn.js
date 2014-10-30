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
pluggedIn.commands = {};

pluggedIn.VERSION = "v0.00.7-A";
pluggedIn.AUTHOR = "R0CK";

pluggedIn.PREFIX = "PluggedIn » ";

pluggedIn.LANGS = ["en"];

pluggedIn.keyboard.SPAM_DJ = 86;

pluggedIn.colors.WARN = "bb0000";
pluggedIn.colors.ALERT = "ddbb00";
pluggedIn.colors.SUCCESS = "55bb00";
pluggedIn.colors.INFO = "009cdd";
pluggedIn.colors.DEFAULT = "ac76ff";

pluggedIn.commands.kill = {
	name:		"kill",
	alias:		["stop","halt"],
	args:		"",
	callback:	(function(){pluggedIn.core.stop();})
};

pluggedIn.commands.status = {
	name:		"status",
	alias:		[],
	args:		"[avail,away,gaming,working]",
	callback:	(function(e){API.setStatus(eval("API.STATUS."+e[0].toUpperCase()));})//Will pass an array for e
};

pluggedIn.commands.help = {
	name:		"help",
	alias:		["commands","command","?"],
	args:		"",
	callback:	(function(){pluggedIn.core.stop();})
};


//Import external scripts

//$.getScript();


//Import external css

//$("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"https://someurl.com/folder/style.css\">");


/*

	Core functionality

*/

//Default Settings
pluggedIn.settings.autoWoot = true;
pluggedIn.settings.autoDJ = true;
pluggedIn.settings.spamDJ = true;
pluggedIn.settings.debug = false;
pluggedIn.settings.chatimg = true;
pluggedIn.settings.lang = 0;
pluggedIn.settings.bg = "http://blog.napc.com/Portals/10319/images/clouds.jpg";//URL

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
			console.warn("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.ALERT+'; font-weight:700;');
		}
	}else{
		console.warn("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.ALERT+'; font-weight:700;');
	}
});

pluggedIn.core.error = (function(msg,debug){
	if(debug){//Will only display if debug enabled
		if(pluggedIn.settings.debug){
			console.error("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.WARN+'; font-weight:700;');
		}
	}else{
		console.error("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.WARN+'; font-weight:700;');
	}
});

pluggedIn.core.info = (function(msg,debug){
	if(debug){//Will only display if debug enabled
		if(pluggedIn.settings.debug){
			console.info("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.INFO+'; font-weight:700;');
		}
	}else{
		console.info("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.INFO+'; font-weight:700;');
	}
});

pluggedIn.core.autoWoot = (function(){
	$("#woot").click();
	API.on(API.ADVANCE,(function(){
		pluggedIn.core.info("Ran autoWoot",true);
		$("#woot").click();
	}));
});

pluggedIn.core.autoDJ = function(){
	API.on(API.ADVANCE,(function(){
		if(API.getWaitListPosition() == -1 && API.getDJ().id != API.getUser().id){
			pluggedIn.core.info("Ran autoDJ",true);
			$("#dj-button").click();
		}
	}));
}

pluggedIn.core.replaceChatImg = (function(){
	API.on(API.CHAT,(function(msg){
		if($(".message").last().children().last().children().length>0){
			if($(".message").last().children().last().children()[0].toString().search(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)(.png|.jpg|.gif|.jpeg)$/g) > -1 ? true : false){
				//$(".message."+msg.type.match(/ from-([\d]{3,}) /g).trim()+">.text").innerHTML = '<img src="'+msg.message.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(.png|.jpeg|.jpg|.gif)$/g)+'" style="display: block; max-width: 100%; height: auto; margin: 0px auto;">';
				var inner = $(".message").last().children().last().children()[0].toString();
				$(".message").last().children().last().children()[0].innerHTML = "<a href=\""+inner+"\"><img src=\""+inner+"\" alt=\""+inner+"\" style=\"display: block; max-width: 100%; height: auto; margin: 0px auto;\"></a>";
				$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
			}
		}
	}));
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
    var hex = hex.toString();
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

pluggedIn.core.getSettings = (function(){
	var c;
	
	if(pluggedIn.core.readCookie("pluggedIn")!=null){
		c = JSON.parse(pluggedIn.core.convertFromHex(pluggedIn.core.readCookie("pluggedIn")));
		
		for(var s in c){
			pluggedIn.settings.s =  c.s;
		}
		
		pluggedIn.core.info("Loaded Settings From Cookie",true);
	}else{
		pluggedIn.core.warn("Settings Cookie did not exist.",true);
		pluggedIn.core.saveSettings();
	}
});

pluggedIn.core.saveSettings = (function(){
	pluggedIn.core.createCookie("pluggedIn",pluggedIn.core.convertToHex(JSON.stringify(pluggedIn.settings)),365);
	pluggedIn.core.info("Created Settings Cookie",true);
});


/*

KEYBOARD SHORTCUTS

*/

$(this).keydown(function (e){
	pluggedIn.core.info("Running Keyboard Shortcut (User Pressed "+String.fromCharCode(e.which)+")",true);
	if(e.which == pluggedIn.keyboard.SPAM_DJ){
		if(pluggedIn.settings.spamDJ){
			var r = true;
			if(r){
				r = false;
			}
			if(API.getWaitListPosition() == -1 && API.getDJ().id != API.getUser().id && API.getWaitList().length<50){
				$("#dj-button").click();
			}
		}
	}
}).keyup(function(e) {
	var r = true;  //Redundant
	if(r){
		pluggedIn.core.info("Finalized Keyboard Shortcut Execution",true);
		r = false;
	}
});

pluggedIn.core.initialize = (function(){
	
	if(pluggedIn.core.executed){
		pluggedIn.core.warn("PluggedIn is already running, skipping initialization");
	}else{
		pluggedIn.core.getSettings();
		
		pluggedIn.core.log(pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.");
		pluggedIn.core.info("Visit https://github.com/itotallyrock/pluggedIn/wiki/Console-Usage for usage.");
		pluggedIn.gui.appendChat("pluggedIn "+pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.<br/>&nbsp;Visit <a href='https://github.com/itotallyrock/pluggedIn/wiki/Console-Usage'>https://github.com/itotallyrock/pluggedIn/wiki/Console-Usage</a> for usage",pluggedIn.colors.INFO);
		
		if(pluggedIn.settings.autoDJ){
			pluggedIn.core.autoDJ();
		}
		if(pluggedIn.settings.autoWoot){
			pluggedIn.core.autoWoot();
		}
		
		if(pluggedIn.settings.chatimg){
			pluggedIn.core.replaceChatImg();
		}
		
		API.on(API.CHAT_COMMAND,function(e){
			var c = e.substring(1).split(" ")[0];
			var args = e.substring(1).split(" ").slice(1);
			pluggedIn.core.info("User typed command /"+c+" ["+args.toString()+"]");
			for(var i in pluggedIn.commands){
				if(c == i){
					eval("pluggedIn.commands."+i).callback(args);
				}else{
					for(var o = 0;o<eval("pluggedIn.commands."+i).alias.length;o++){
						if(c == eval("pluggedIn.commands."+i).alias[o]){
							eval("pluggedIn.commands."+i).callback(args);
						}else{
							//No command or alias matched
							pluggedIn.core.warn("No command or alias matched "+c,true);
						}
					}
				}
			}
		});
		
		pluggedIn.core.executed = true;
	}
});

pluggedIn.core.update = (function(){
	pluggedIn.core.saveSettings();
	
	API.off(API.WAIT_LIST_UPDATE);
	API.off(API.CHAT_COMMAND);
	API.off(API.CHAT);
	
	pluggedIn.core.getSettings();
	
	if(pluggedIn.settings.autoDJ){
		pluggedIn.core.autoDJ();
	}
	if(pluggedIn.settings.autoWoot){
		pluggedIn.core.autoWoot();
	}
		
	if(pluggedIn.settings.chatimg){
		pluggedIn.core.replaceChatImg();
	}
});

pluggedIn.core.stop = (function(callback){
	API.off(API.WAIT_LIST_UPDATE);
	API.off(API.CHAT_COMMAND);
	API.off(API.CHAT);
	
	if(!callback){
		pluggedIn.gui.appendChat("PluggedIn has been sucessfully stopped",pluggedIn.colors.SUCCESS);
		pluggedIn.core.info("PluggedIn has been sucessfully stopped");
	}else{
		pluggedIn.gui.appendChat("PluggedIn has been sucessfully stopped",pluggedIn.colors.ALERT);
		pluggedIn.core.alert("PluggedIn has stopped unexpectedly with crash code "+callback);
	}
	
	pluggedIn = undefined;
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


pluggedIn.gui.moveTopBar = (function(){
	$("#room-bar.bar-button")[0].style.width="343px";$("#room-bar.bar-button")[0].style.left="103px";
});

pluggedIn.gui.drawTopButton = (function(){
	$(".app-header").append('<div style="width: 50px;top: 7px;left: 60px;height: 54px;position: absolute;"><i class="icon icon-plug-dj"></i></div>');
});


pluggedIn.gui.changeBackground = (function(url){
	$("i.room-background")[0].style.backgroundSize="100%";
	$("i.room-background")[0].style.background = "url('"+url+"') no-repeat";
});

pluggedIn.core.initialize();

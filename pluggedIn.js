/*

Javascript Plugged.in addon
© 2014 itotallyrock.tk

Modifying the source code of this file for personal use is allowed,
however redistributing of this product modified or not is disallowed.

Some of the features you have from using this addon may be frowned upon by certain communities, use responsibly.

Version 0.01.1 ALPHA

*/

var pluggedIn = {
	VERSION: "v0.01.1-A",
	AUTHOR: "R0CK",
	PREFIX: "PluggedIn » ",
	LANGS: ["en","pt","de"],
	
	commands:{
		kill: {
			name:		"kill",
			alias:		["stop","halt"],
			args:		"",
			callback:	function(){pluggedIn.core.stop();}
		},

		status: {
			name:		"status",
			alias:		[],
			args:		"[avail,away,gaming,working]",
			callback:	function(e){
							try{
								API.setStatus(API.STATUS[e[0].toUpperCase()]);
							}catch(err){
								pluggedIn.appendChat("Usage:<br/>/status [avail,away,gaming,working]",pluggedIn.colors.WARN);
							}
						}
		},

		commands: {
			name:		"commands",
			alias:		["command","?"],
			args:		"",
			callback:	function(){
							var c;
							for(c in pluggedIn.commands){
								c = pluggedIn.commands[c];
								pluggedIn.gui.appendChat(c.name+" "+c.args,pluggedIn.colors.DEFAULT);
							}
						}
		},

		afk: {
			name:		"afk",
			alias:		["away"],
			args:		"",
			callback:	function(){
							pluggedIn.core.toggleAfk();
						}
		}
	},
	
	core:{
		log: function(msg,debug){
			if(debug){//Will only display if debug enabled
				if(pluggedIn.settings.debug){
					console.log("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.DEFAULT+'; font-weight:700;');
				}
			}else{
				console.log("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.DEFAULT+'; font-weight:700;');
			}
		},

		warn: function(msg,debug){
			if(debug){//Will only display if debug enabled
				if(pluggedIn.settings.debug){
					console.warn("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.ALERT+'; font-weight:700;');
				}
			}else{
				console.warn("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.ALERT+'; font-weight:700;');
			}
		},

		error: function(msg,debug){
			if(debug){//Will only display if debug enabled
				if(pluggedIn.settings.debug){
					console.error("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.WARN+'; font-weight:700;');
				}
			}else{
				console.error("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.WARN+'; font-weight:700;');
			}
		},

		info: function(msg,debug){
			if(debug){//Will only display if debug enabled
				if(pluggedIn.settings.debug){
					console.info("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.INFO+'; font-weight:700;');
				}
			}else{
				console.info("%c"+pluggedIn.PREFIX+msg,'color: #'+pluggedIn.colors.INFO+'; font-weight:700;');
			}
		},
		
		convertToHex: function(str){
			var hex = '',i;
			for(i=0;i<str.length;i++) {
				hex += str.charCodeAt(i).toString(16);
			}
			return hex;
		},

		convertFromHex: function(hex){
			var str = '',i;
			for (i = 0; i < hex.toString().length; i += 2){
				str += String.fromCharCode(parseInt(hex.toString().substr(i, 2), 16));
			}
			return str;
		},

		createCookie: function(name,value,days){
			var expires = "";
			if(days){
				new Date().setTime(new Date().getTime()+(days*24*60*60*1000));
				expires = "; expires="+new Date().toGMTString();
			}
			document.cookie = name+"="+value+expires+"; path=/";
		},

		readCookie: function (name){
			var nameEQ = name + "=",ca = document.cookie.split(';'),i,c;
			for(i=0;i < ca.length;i++){
				c = ca[i];
				while(c.charAt(0) === ' '){
					c = c.substring(1,c.length);
				}
				if(c.indexOf(nameEQ) === 0){
					return c.substring(nameEQ.length,c.length);
				}
			}
			return null;
		},

		eraseCookie: function(name){
			pluggedIn.core.createCookie(name,"",-1);
		},

		getSettings: function(){
			var c,s;
			
			if(document.cookie.indexOf("pluggedIn")>0){
				c = JSON.parse(pluggedIn.core.convertFromHex(pluggedIn.core.readCookie("pluggedIn")));
				for(s in c){
					pluggedIn.core.log("set pluggedIn.settings."+s+" = "+c[s],true);
					pluggedIn.settings[s] = c[s];
				}
				
				pluggedIn.core.info("Loaded Settings From Cookie",true);
				pluggedIn.core.saveSettings();
			}else{
				pluggedIn.core.warn("Settings Cookie did not exist.",true);
				pluggedIn.core.saveSettings();
			}
			
			pluggedIn.settings.afk = false; //A Little Messy but it gets rid of AFK on load (Doesn't save it.)
		},

		saveSettings: function(){
			pluggedIn.core.eraseCookie("pluggedIn");
			pluggedIn.core.createCookie("pluggedIn",pluggedIn.core.convertToHex(JSON.stringify(pluggedIn.settings)),365);
			pluggedIn.core.info("Created Settings Cookie",true);
		},
		
		autoWoot: function(){
			$("#woot").click();
			API.on(API.ADVANCE,function(){
				pluggedIn.core.info("Ran autoWoot",true);
				$("#woot").click();
			});
		},

		autoDJ: function(){
			API.on(API.ADVANCE,function(){
				if(API.getWaitListPosition() === -1 && API.getDJ().id !== API.getUser().id){
					pluggedIn.core.info("Ran autoDJ",true);
					$("#dj-button").click();
				}
			});
		},

		replaceChatImg: function(){
			API.on(API.CHAT,function(){
				if($(".message").last().children().last().children().length > 0){
					if($(".message").last().children().last().children()[0].toString().search(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)(.png|.jpg|.gif|.jpeg)$/g) > -1){
						var inner = $(".message").last().children().last().children()[0].toString();
						$(".message").last().children().last().children()[0].innerHTML = "<a href=\""+inner+"\"><img src=\""+inner+"\" alt=\""+inner+"\" style=\"display: block; max-width: 100%; height: auto; margin: 0px auto;\"></a>";
						$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
					}
				}
			});
		},

		afkMessage: function(){
			var mentionBy = "^@("+API.getUser().username.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")+")";
			API.on(API.CHAT,function(e){
				if(e.message.search(new Regexp(mentionBy)) > -1){
					if(pluggedIn.settings.afk){
						API.sendChat("@"+e.un+" "+pluggedIn.settings.afkMsg);
					}
				}
			});
		},
		
		initialize: function(){
			if(pluggedIn.core.executed){
				pluggedIn.core.warn("PluggedIn is already running, skipping initialization");
			}else{
				pluggedIn.core.getSettings();
				
				pluggedIn.core.log(pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.");
				pluggedIn.core.info("Visit https://github.com/itotallyrock/pluggedIn/wiki/Console-Usage for usage.");
				pluggedIn.gui.appendChat("pluggedIn "+pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.<br/>Visit <a href='https://github.com/itotallyrock/pluggedIn/wiki/Console-Usage'>the wiki</a> for usage",pluggedIn.colors.INFO);
				
				if(pluggedIn.settings.autoDJ){
					pluggedIn.core.autoDJ();
				}
				if(pluggedIn.settings.autoWoot){
					pluggedIn.core.autoWoot();
				}
				
				if(pluggedIn.settings.chatimg){
					pluggedIn.core.replaceChatImg();
				}
				
				if(pluggedIn.settings.notifications.userUpdate){
					API.on(API.USER_LEAVE,function(e){pluggedIn.gui.appendChat(e.username+" has left the room.","2fcf56")})
					API.on(API.USER_JOIN,function(e){pluggedIn.gui.appendChat(e.username+" has joined the room.","2fcf56")})
				}
				
				API.on(API.CHAT_COMMAND,function(e){
					var c = e.substring(1).split(" ")[0],args = e.substring(1).split(" ").slice(1),o,i;
					pluggedIn.core.info("User typed command /"+c+" ["+args.toString()+"]");
					for(i in pluggedIn.commands){
						if(c === i){
							$("#chat-input-field").val("");
							pluggedIn.commands[i].callback(args);
							//break;
						}else{
							for(o = 0;o<pluggedIn.commands[i].alias.length;o++){
								if(c === pluggedIn.commands[i].alias[o]){
									pluggedIn.commands[i].callback(args);
									//break;
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
		},
		
		toggleAfk: function(){
			API.off(API.CHAT);
			if($(".description.panel>.value")[0].innerText.toLowerCase().search(pluggedIn.rooms.rules.afk.toLowerCase()) === -1){
				if(pluggedIn.settings.afk){
					pluggedIn.settings.afk = false;
					pluggedIn.gui.appendChat("You are no longer AFK",pluggedIn.colors.SUCCESS);
				}else{
					pluggedIn.settings.afk = true;
					pluggedIn.gui.appendChat("You are now AFK",pluggedIn.colors.SUCCESS);
					pluggedIn.core.afkMessage();
				}
			}else{
				pluggedIn.gui.appendChat("This room has AFK disabled",pluggedIn.colors.ALERT);
			}
		},
		
		update: function(){
			pluggedIn.core.saveSettings();
			
			API.off(API.WAIT_LIST_UPDATE);
			API.off(API.CHAT_COMMAND);
			API.off(API.CHAT);
			API.off(API.USER_JOIN);
			API.off(API.USER_LEAVE);
			
			pluggedIn.core.getSettings();
			
			if(pluggedIn.settings.autoDJ){
				if($(".description.panel>.value")[0].innerText.toLowerCase().search(pluggedIn.rooms.rules.autoDJ.toLowerCase()) === -1){
					pluggedIn.core.autoDJ();
				}else{
					pluggedIn.gui.appendChat("This room has AutoDJ disabled",pluggedIn.colors.ALERT);
				}
			}
			if(pluggedIn.settings.autoWoot){
				pluggedIn.core.autoWoot();
				if($(".description.panel>.value")[0].innerText.toLowerCase().search(pluggedIn.rooms.rules.autoWoot.toLowerCase()) === -1){
					pluggedIn.core.afkMessage();
				}else{
					pluggedIn.gui.appendChat("This room has AutoWoot disabled",pluggedIn.colors.ALERT);
				}
			}
				
			if(pluggedIn.settings.chatimg){
				pluggedIn.core.replaceChatImg();
			}
			
			if(pluggedIn.settings.afk){
				pluggedIn.core.toggleAfk();
			}
			
			if(pluggedIn.settings.notifications.userUpdate){
				API.on(API.USER_LEAVE,function(e){pluggedIn.gui.appendChat(e.username+" has left the room.","2fcf56")})
				API.on(API.USER_JOIN,function(e){pluggedIn.gui.appendChat(e.username+" has joined the room.","2fcf56")})
			}
			
			API.on(API.CHAT_COMMAND,function(e){
				var c = e.substring(1).split(" ")[0],args = e.substring(1).split(" ").slice(1),i,o;
				pluggedIn.core.info("User typed command /"+c+" ["+args.toString()+"]");
				for(i in pluggedIn.commands){
					if(c === i){
						$("#chat-input-field").val("");
						pluggedIn.commands[i].callback(args);
					}else{
						for(o = 0;o<pluggedIn.commands[i].alias.length;o++){
							if(c === pluggedIn.commands[i].alias[o]){
								pluggedIn.commands[i].callback(args);
							}else{
								pluggedIn.core.warn("No command or alias matched "+c,true);
							}
						}
					}
				}
			});
		},
				
		stop: function(callback){
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
		}

	},
	
	gui:{
		appendChat: function(message,color){
			if(message){
				if(color){
					$("#chat-messages").append('<div class="welcome" style="border-left: #'+color+' 3px solid;color: #'+color+';"><span class="text" style="font-weight:800;">' + message + '</span></div>');
				}else{
					$("#chat-messages").append('<div class="welcome"><span class="text" style="font-weight:800;">' + message + '</span></div>');
				}
				
				$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
			}
		},

		notify: function(i,m){
			require("b20d6/f1e58/e027b").trigger("notify",i,m);
		},

		confirm: function(t,b){
			require(["b20d6/f1e58/e027b", "b20d6/ea5ff/bb81d"], function(n,s){n.dispatch(new s(s.CONFIRM, t, b));});
		},
		
		alert: function(t,b){
			require(["b20d6/f1e58/e027b","b20d6/ea5ff/bb81d"],function(r,s){r.dispatch(new s(s.ALERT, t, b));});
		},

		moveTopBar: function(){
			$("#room-bar.bar-button")[0].style.width="343px";$("#room-bar.bar-button")[0].style.left="103px";
		},

		drawTopButton: function(){
			$(".app-header").append('<div style="width: 50px;top: 7px;left: 60px;height: 54px;position: absolute;"><i class="icon icon-plug-dj"></i></div>');
		},
		
		toggleVideo: function(){
			$("#playback").toggle();
		}
		
		changeBackground: function(url){
			$("i.room-background")[0].style.backgroundSize="100%";
			$("i.room-background")[0].style.background = "url('"+url+"') no-repeat";
		}
	},
	
	keyboard:{
		main: $(this).keydown(function (e){
			pluggedIn.core.info("Running Keyboard Shortcut (User Pressed "+String.fromCharCode(e.which)+")",true);
			switch(e.which){
				case pluggedIn.settings.keyboard.SPAM_DJ:
					if($(".description.panel>.value")[0].innerText.toLowerCase().search(pluggedIn.rooms.rules.spamDJ.toLowerCase()) > -1){
						if(pluggedIn.settings.spamDJ){
							if(API.getWaitListPosition() === -1 && API.getDJ().id !== API.getUser().id && API.getWaitList().length<50){
								$("#dj-button").click();
							}
						}
					}
					break;
				//case pluggedIn.settings.keyboard.DERP:
			}
		})
	},
	
	colors:{
		WARN: "bb0000",
		ALERT: "ddbb00",
		SUCCESS: "6ff01a",
		INFO: "009cdd",
		DEFAULT: "ac76ff"
	},
	
	rooms: {
		rules:{
			autoWoot:"pluggedin-rules-autowoot-block",
			autoDJ:"pluggedin-rules-autoDJ-block",
			spamDJ:"pluggedin-rules-spamDJ-block",
			afk:"pluggedin-rules-afk-block"
		}
	},
	
	//Default Settings
	settings: {
		autoWoot: true,
		autoDJ: true,
		spamDJ: true,
		debug: false,
		chatimg: true,
		lang: 0,
		bg: "http://blog.napc.com/Portals/10319/images/clouds.jpg",//URL
		afk: false,
		afkMsg: "I'm currently AFK.",
		keyboard:{
			SPAM_DJ: 86//V
			//SOMETHING_ELSE: 106//L
		},
		notifications:{
			songStats: false,
			userUpdate: true
		}
	}
};

//Import external scripts
//$.getScript();
//$("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"https://someurl.com/folder/style.css\">");

pluggedIn.core.initialize();

/*

Javascript Plugged.in addon
© 2014 itotallyrock.tk

Modifying the source code of this file for personal use is allowed,
however redistributing of this product modified or not is disallowed.

Some of the features you have from using this addon may be frowned upon by certain communities, use responsibly.

Version 0.01.3 ALPHA

*/
if(typeof window.spqe == "undefined"){

//Import external scripts
//$.getScript("https://code.jquery.com/ui/1.11.2/jquery-ui.js");
$("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"https://rawgit.com/itotallyrock/pluggedIn/master/pluggedIn.css\">");

(function ($) {
    $.fn.drags = function (opt) {
		/*Drags addon courtesy of Chris Coyier (http://csstricks.com)*/
        opt = $.extend({
            handle: "",
            cursor: "move"
        }, opt);

        if (opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function (e) {
            if (opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000000).parents().on("mousemove", function (e) {
                $('.draggable').offset({
                    top: e.pageY + pos_y - drg_h,
                    left: e.pageX + pos_x - drg_w
                }).on("mouseup", function () {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function () {
            if (opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);

var pluggedIn = {
	VERSION: "v0.01.3-A",
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
		
		deleteSettings: function(){
			if(typeof pluggedIn.gui.confirm("Delete Settings","Are you sure you want to erase all pluggedIn settings?") == "undefined"){
				eraseCookie("pluggedIn");
				pluggedIn.gui.notify("icon-delete","All PluggedIn Settings Have Been Cleared");
			}
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
						$(".message").last().children().last().children()[0].innerHTML = "<a href=\""+inner+"\" target=\"_blank\"><img src=\""+inner+"\" alt=\""+inner+"\" style=\"display: block; max-width: 100%; height: auto; margin: 0px auto;\"></a>";
						$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
					}
				}
			});
		},

		afkMessage: function(){
			var mentionBy = "^@("+API.getUser().username.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")+")";
			API.on(API.CHAT,function(e){
				if(e.message.search(new RegExp(mentionBy)) > -1){
					if(pluggedIn.settings.afk){
						API.sendChat("@"+e.un+" "+pluggedIn.settings.afkMsg);
					}
				}
			});
		},
		
		initialize: function(){
			window.spqe = true;
			
			pluggedIn.core.getSettings();
				
			pluggedIn.core.log(pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.");
			pluggedIn.core.info("Visit https://github.com/itotallyrock/pluggedIn/wiki/Console-Usage for usage.");
			pluggedIn.gui.appendChat("pluggedIn "+pluggedIn.VERSION+" by "+pluggedIn.AUTHOR+" has loaded.<br/>Visit <a href='https://github.com/itotallyrock/pluggedIn/wiki/Console-Usage'>the wiki</a> for usage",pluggedIn.colors.INFO);
				
			pluggedIn.gui.showSongPopup();
			
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
				API.on(API.USER_LEAVE,function(e){
					$("#chat-messages").append('<div style="color: #2fcf56;" class="message"><span class="text" style="font-weight:300;"><a style="color: inherit;" href="#'+e.username+'">'+e.username+'</a> has left the room.</span></div>');
					$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
				});
				API.on(API.USER_JOIN,function(e){
					$("#chat-messages").append('<div style="color: #2fcf56;" class="message"><span class="text" style="font-weight:300;"><a style="color: inherit;" href="#'+e.username+'">'+e.username+'</a> has joined the room.</span></div>');
					$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
				});
			}
				
			API.on(API.WAIT_LIST_UPDATE,function(e){
				pluggedIn.gui.showSongPopup();
			});
				
			API.on(API.CHAT_COMMAND,function(e){
				var c = e.substring(1).split(" ")[0],args = e.substring(1).split(" ").slice(1),o,i;
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
			
			pluggedIn.gui.drawDraggable();
			
			$('#pluggedIn-draggable').drags({ handle: $("#pluggedIn-draggable-header")})
			
			var drag;
			if(typeof $.ui == "undefined")$.getScript("https://code.jquery.com/ui/1.11.2/jquery-ui.js");
			$('#pluggedIn-draggable').draggable({
				distance:20,
				handle:'#pluggedIn-draggable-header',
				containment:'#app',
				scroll:false,
				start:function(){drag = true},
				stop:function(e,ui){
					drag = false;
					settings.uipos = ui.position;
					pluggedIn.core.saveSettings();
				}
			});
		},
		
		toggleAfk: function(){
			API.off(API.CHAT);
			if($(".description.panel>.value")[0].innerText.toLowerCase().search(pluggedIn.rooms.rules.afk.toLowerCase()) === -1){
				pluggedIn.settings.afk = false;
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
			
			pluggedIn.gui.showSongPopup();
			
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
				API.on(API.USER_LEAVE,function(e){
					$("#chat-messages").append('<div style="color: #2fcf56;" class="message"><span class="text" style="font-weight:300;"><a style="color: inherit;" href="#'+e.username+'">'+e.username+'</a> has left the room.</span></div>');
					$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
				});
				API.on(API.USER_JOIN,function(e){
					$("#chat-messages").append('<div style="color: #2fcf56;" class="message"><span class="text" style="font-weight:300;"><a style="color: inherit;" href="#'+e.username+'">'+e.username+'</a> has joined the room.</span></div>');
					$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
				});
			}
			
			API.on(API.WAIT_LIST_UPDATE,function(e){
				pluggedIn.gui.showSongPopup();
			});
			
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
			
			$("*[id^='pluggedIn']").remove()
			
			pluggedIn = undefined;
		}
	},
	
	gui:{
		draggable: '<div id="pluggedIn-draggable">'+
							'<div id="pluggedIn-draggable-header">Header</div>'+
							'<div id="pluggedIn-draggable-body">'+
								'Test Content'+
							'</div>'+
						'</div>',
		
		appendChat: function(message,color){
			if(message){
				if(color){
					$("#chat-messages").append('<div class="welcome" style="border-left: #'+color+' 3px solid;color: #'+color+';"><span class="text" style="font-weight:800;">' + message + '</span></div>');
				}else{
					$("#chat-messages").append('<div class="welcome"><span class="text" style="font-weight:800;">' + message + '</span></div>');
				}
				
				$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
			}else{
				console.error("pluggedIn.gui.appendChat() missing argument 'Message' correct usage pluggedIn.gui.appendChat(Message,[Color])");
			}
		},
		
		showSongPopup: function(){
			//$(".bar-value")[1].id = "pi-title";
			//$("#pi-title").hover(function(e){console.log(e);});
			$(".bar-value")[1].title = API.getMedia().author + " - " + API.getMedia().title;
		},
		
		notify: function(i,m){
			require("b20d6/f1e58/e027b").trigger("notify",i,m);
		},

		confirm: function(t,b){
			var r;
			require(["b20d6/f1e58/e027b", "b20d6/ea5ff/bb81d","underscore"], function(n,s,u){r = n.dispatch(new s(s.CONFIRM, t, b,u.bind(function(e){console.log(e);})));});
			$(".button.submit").first().click(function(){return r;});
		},
		
		alert: function(t,b){
			require(["b20d6/f1e58/e027b","b20d6/ea5ff/bb81d"],function(r,s){r.dispatch(new s(s.ALERT, t, b));});
		},

		/*moveTopBar: function(){
			$("#room-bar.bar-button")[0].style.width="343px";$("#room-bar.bar-button")[0].style.left="103px";
		},

		drawTopButton: function(){
			$(".app-header").append('<div style="width: 50px;top: 7px;left: 60px;height: 54px;position: absolute;"><i class="icon icon-plug-dj"></i></div>');
		},*/
		
		addTab: function(){
			$(".user.menu").append('<div class="item pluggedIn"><i class="icon" style="background: url(\'data:image/png;base64,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\');background-size: 120%;background-size: 120%;top: 6px;"></i><span>PluggedIn</span></div>');
		},
		
		drawDraggable: function(){
			$("body").append(this.draggable);
		},
		
		toggleVideo: function(){
			$("#playback").toggle();
		},
		
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
		SUCCESS: "4bbd00",
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

pluggedIn.core.initialize();

}else{
	pluggedIn.gui.appendChat("PluggedIn is already running, skipping initialization",pluggedIn.colors.WARN);
}
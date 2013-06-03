
var App = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('deviceready');
        try
        {
            pushNotification = window.plugins.pushNotification;
            if (device.platform == 'android' || device.platform == 'Android') {
                console.log('Registering Android PN');
                pushNotification.register(successHandler, errorHandler, {"senderID":"661780372179","ecb":"onNotificationGCM"});		// required!
            } else {
                console.log('Registering iOS PN');
                pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
            }
        }
        catch(err)
        {
            txt="There was an error on this page.\n\n";
            txt+="Error description: " + err.message + "\n\n";
            alert(txt);
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


// handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
        console.log('Apple push-notification: ' + e.alert);
        navigator.notification.alert(e.alert);
    }
    
    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }
    
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
    console.log('Andriod PN EVENT -> RECEIVED:' + e.event);
    
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                console.log('Andriod PN REGISTERED -> REGID:' + e.regid);
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log("regID = " + e.regID);
            }
            break;
            
        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {
                console.log('Andriod PN --INLINE NOTIFICATION--');
                
                // if the notification contains a soundname, play it.
                var my_media = new Media("/res/res/"+e.soundname);
                my_media.play();
            }
            else
            {	// otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart)
                    console.log('Andriod PN --COLDSTART NOTIFICATION--');
                else
                    console.log('Andriod PN --BACKGROUND NOTIFICATION--');
            }
            
            console.log('Andriod PN MESSAGE -> MSG: ' + e.payload.message);
            console.log('Andriod PN MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
            break;
            
        case 'error':
            console.log('Andriod PN ERROR -> MSG:' + e.msg);
            break;
            
        default:
            console.log('Andriod PN EVENT -> Unknown, an event was received and we do not know what it is');
            break;
    }
}

function tokenHandler (result) {
    console.log('iOS PN token: '+ result);
    console.log("P" + pushNotification);
    
    cordova.exec(null, null, "PushPlugin", "checkNotificationReceived", []);
   

    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler (result) {
    console.log('Android PN Token success:'+ result);
}

function errorHandler (error) {
    console.log('Token error:'+ error);
}



App.initialize();
App.isUserLogged = true;
var mapAPIisLoaded = false;

App.setFirstTimeUser = function (){
	$("#pannelUserBtn").hide();
	$("#pannelGuestBtn").show();
	console.log("3");
}



App.OpenMapPage	=	function (){
			
			
			MapController.loadMapApi();
			
		}

$(document).bind("mobileinit",function(){
	console.log("mobileinit");
	
 
	if(App.LANG == "en"){
		Loc = enLoc;
		Loc.Dir = "ltr";
	}else{
		Loc = arLoc;
		Loc.Dir = "rtl";
	}
	//$.mobile.autoInitializePage = false;
	if(App.isUserLogged == true ){
		document.location.hash = "#login-page";
		console.log("1");
	}else{
		document.location.hash = "#news-page";
			console.log("2");
	}
	
	//$.mobile.initializePage();
	
	LoginController.init();
	RegController.init();
	AppoController.init();
	NewsController.init();
	StaffController.init();
	MapController.init();
	SettingsController.init();
});


(function($) {
	/*
	 * Changes the displayed text for a jquery mobile button. Encapsulates the
	 * idiosyncracies of how jquery re-arranges the DOM to display a button for
	 * either an <a> link or <input type="button">
	 */
	$.fn.changeButtonText = function(newText) {
		return this.each(function() {
			$this = $(this);
			if ($this.is('a')) {
				$('span.ui-btn-text', $this).text(newText);
				return;
			}
			if ($this.is('input')) {
				$this.val(newText);
				// go up the tree
				var ctx = $this.closest('.ui-btn');
				$('span.ui-btn-text', ctx).text(newText);
				return;
			}
		});
	};

	$.fn.disableButton = function() {
		return this.each(function() {
			$this = $(this);
			if ($this.is('a')) {
				$this.addClass('ui-disabled');
				return;
			}
			if ($this.is('input')) {
				$this.button("disable");
				return;
			}
		});
	};

	$.fn.enableButton = function() {
		return this.each(function() {
			$this = $(this);
			if ($this.is('a')) {
				$this.removeClass('ui-disabled');
				return;
			}
			if ($this.is('input')) {
				$this.button("enable");
				return;
			}
		});
	};
})(jQuery);


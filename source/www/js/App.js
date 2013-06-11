
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
            
            if (device.platform == 'android' || device.platform == 'Android') {
            	pushNotification = window.plugins.pushNotification;
                console.log('Registering Android PN');
                pushNotification.register(androidTokenHandler, errorHandler, { "senderID": "815750722565", "ecb": "onNotificationGCM" });		// required!
            } else if (device.platform == 'iOS') {
            	pushNotification = window.plugins.pushNotification;
                console.log('Registering iOS PN');
                pushNotification.register(iOSTokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
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
    console.log('Android PN EVENT -> RECEIVED:' + e.event);
    
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                console.log('Android PN REGISTERED -> REGID:' + e.regid);
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log("regID = " + e.regid);
            }
            break;
            
        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {
                console.log('Android PN --INLINE NOTIFICATION--');
                
                // if the notification contains a soundname, play it.
                var my_media = new Media("/res/res/"+e.soundname);
                my_media.play();
            }
            else
            {	// otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart)
                    console.log('Android PN --COLDSTART NOTIFICATION--');
                else
                    console.log('Android PN --BACKGROUND NOTIFICATION--');
            }
            
            console.log('Android PN MESSAGE -> MSG: ' + e.payload.message);
            console.log('Android PN MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
            
            if (e.payload.message != null || e.payload.message != undefined) {
                navigator.notification.alert(e.payload.message);
            }
            
            break;
            
        case 'error':
            console.log('Android PN ERROR -> MSG:' + e.msg);
            break;
            
        default:
            console.log('Android PN EVENT -> Unknown, an event was received and we do not know what it is');
            break;
    }
}

// handle APNS notifications for iOS
function onNotificationWinPhone(e) {
    if (e) {
        console.log('Windows Phone push-notification: ' + e);
        navigator.notification.alert(e);
    }
}
var lastF;
$('#userIDInput').keydown(function (event) {
    alert("kd " + event.which);
    event.preventDefault();
    event.returnValue = false;
  //  event.stop();
    lastF = this;
    this.blur();
    return false;
});


$('#userIDInput').keypress(function (event) {
    alert("kp " + event.which);

  //  event.preventDefault();
   // event.returnValue = false;
    //return false;
});



$('#userIDInput').keyup(function (event) {

    alert("ku " + event.which);
});
function iOSTokenHandler(result) {
    console.log('iOS PN token: '+ result);
    console.log("P" + pushNotification);
    
    cordova.exec(null, null, "PushPlugin", "checkNotificationReceived", []);
   

    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function androidTokenHandler(result) {
    console.log('Android PN Token success:' + result);
}

function winPhoneTokenHandler(result) {
    console.log('Windows Phone PN Token success:' + result);
}

function successHandler (result) {
    //console.log('Android PN Token success:'+ result);
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
	
 //init
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


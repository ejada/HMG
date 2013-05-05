
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
        app.receivedEvent('deviceready');
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

App.initialize();
App.LANG = "en";
var mapAPIisLoaded = false;

App.OpenMapPage	=	function (){
			
			//TODO: test
//			$.mobile.changePage("#page-map");
//			DataContext.getMapCitiesNames();
//			return;
			//end
			$.mobile.changePage("#page-map");
			
			
		}

$(document).bind("mobileinit",function(){
	console.log("ksn");
	LoginController.init();
	MapController.init();
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

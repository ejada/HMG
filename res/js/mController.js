var MapController =  MapController || {};

var map;


MapController = (function(){
	
	var mapPageSel = "#map-page";
	
	function init(){
		
		$(mapPageSel).on("pageshow", function() {
			
				var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
				 
		});	

			
	} // init()
	

	function loadMapApi(){
		console.log("loadMapApi");
		if(typeof google === 'object' && typeof google.maps === 'object'){
			
		}else{
			var element = document.createElement('script');
			element.src ='http://maps.googleapis.com/maps/api/js?sensor=true&callback=MapController.Initialize';
			element.type = 'text/javascript';
			var scripts = document.getElementsByTagName('script')[0];
			scripts.parentNode.insertBefore(element, scripts);
		}
		
		$.mobile.changePage("#map-page");
	}
	
	function Initialize(){
		google.maps.visualRefresh = true;
		var MapOptions = {
				zoom: 15,
				center: new google.maps.LatLng(37.20084, -93.28121),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				sensor: true
			};
			
			map=new google.maps.Map(document.getElementById("mapCanvas"), MapOptions);
			
			//Delay customizations until the map has loaded
			var element = document.createElement('script');
			element.src = 'js/template.js';
			element.type = 'text/javascript';
			var scripts = document.getElementsByTagName('script')[0];
			scripts.parentNode.insertBefore(element, scripts);
		
				console.log("Initialize");
		
	}
	
	
	return {
		init:init
		,loadMapApi:loadMapApi
		,Initialize:Initialize
	}
})();

var MapController =  MapController || {};

MapController = (function(){
	
	var mapPageSel = "#map-page";
	
	function init(){
		
		$(mapPageSel).on("pagebeforeshow", function() {
			
				//$(mapPageSel).trigger('create');
		});	

			
	} // init()
	

	function loadMapApi(){
		console.log("loadMapApi");
		var element = document.createElement('script');
		element.src ='http://maps.google.com/maps/api/js?sensor=true&callback=MapController.Initialize';
		element.type = 'text/javascript';
		var scripts = document.getElementsByTagName('script')[0];
		scripts.parentNode.insertBefore(element, scripts);
	}
	
	function Initialize(){
		
		var MapOptions = {
				zoom: 15,
				center: new google.maps.LatLng(37.20084, -93.28121),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				sensor: true
			};
			
			map=new google.maps.Map(document.getElementById("mapCanvas"), MapOptions);
				
				console.log("Initialize");
		$.mobile.changePage("#map-page");
	}
	
	
	return {
		init:init
		,loadMapApi:loadMapApi
		,Initialize:Initialize
	}
})();

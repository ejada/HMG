var SettingsController =  SettingsController || {};

SettingsController = (function(){
	
	var settingsPageSel	= "#settings-page";
	
	
	function init(){
	
		$(settingsPageSel).on("pagebeforeshow", function() {
			console.log(App.LANG);
			$("#choice-lang-"+App.LANG).attr ("checked", "checked").checkboxradio ("refresh");
			
			$("#changeLang").on('change', function(event) {
				console.log($("input[name*=choice-lang]:checked").val());
				var page = window.location.href; 
				page = page.substring(page.indexOf("/HMG/")+5,page.lastIndexOf(".html")+5);
				console.log(page);
			});	
		});	
		
	} // init()
	

	return {
		init:init
	}
})();

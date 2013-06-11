var SettingsController =  SettingsController || {};

SettingsController = (function(){
	
	var settingsPageSel	= "#settings-page";
	
	
	function init(){
	
		$(settingsPageSel).on("pagebeforeshow", function() {
			console.log(App.LANG);
			$("#choice-lang-"+App.LANG).attr ("checked", "checked").checkboxradio ("refresh");
			
			$("#changeLang").on('change', function(event) {
				var checked = $("input[name*=choice-lang]:checked").val();
				console.log(checked);
				var page = window.location.href; 
				page = page.substring(page.indexOf("/HMG/")+9,page.lastIndexOf(".html")+5);
				
				if(checked == "ar")
					page = page.replace("en","ar");
				else
					page = page.replace("ar","en");
					
				
				console.log(page);
				window.location = page+"#settings-page";
				
			});	
		});	
		
	} // init()
	

	return {
		init:init
	}
})();

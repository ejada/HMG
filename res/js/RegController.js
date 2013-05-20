var RegController =  RegController || {};

RegController = (function(){
	
	var regPage	= "#reg-page";
	
	var regBtn	= "#regBtn";
	
	var userIDType	= "#selectIDType";
	var userID		= "#idVal";
	var userFName	= "#userFirstNameVal";
	var userLName	= "#userLastNameVal";
	var userMobile	= "#userMobileVal";
	
	
	function init(){
		
		$(regPage).on("pagebeforeshow", function() {
			localizeRegPage();
			$(regBtn).disableButton();

			
		});		
		
		
	} // init()
	

	function localizeRegPage(){
		
		
		//$(userID).attr("placeholder",Loc.loginPage.userIdLB);
		$(userID).attr("value","");
		$(userFName).attr("value","");
		$(userLName).attr("value","");
		$(userMobile).attr("value","");
		
		renderIDTypeList();
		
	}
	
	
	function renderIDTypeList(){
		
		//TODO: get IDType List from webservice or Localized static list
		var list = [{code:"1",value:"ID"},{code:"2",value:"IQAMA"},{code:"3",value:"Passport"}];
		
		if (list) {
			for ( var i = 0; i < list.length; i++) {
				var elmt = list[i];
				$(userIDType).append("<option value=" + elmt.code + "> "+ elmt.value + " </option>");
			}
			$(userIDType).selectmenu("refresh", true); // true 
		}
	}
	
	
	
	return {
		init:init,
		
	}
})();





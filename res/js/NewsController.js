var NewsController =  NewsController || {};

NewsController = (function(){
	
	var newsPageSel	= "#news-page";
	
	
	function init(){
		
		
		
		$(newsPageSel).on("pagebeforeshow", function() {
			localizeNewsPage();

			
		});		
		
		
	} // init()
	

	function localizeNewsPage(){
		
		$("#newsHeader").text(Loc.loginPage.header)
		
		$("#idTitle").text(Loc.loginPage.id);
		$("#mobileTitle").text(Loc.loginPage.mobile);
		
		$(loginPageSel).attr("dir",Loc.Dir);
		
		//$(userID).attr("placeholder",Loc.loginPage.userIdLB);
		$(userID).attr("value","");
		
		//$(userMobile).attr("placeholder",Loc.loginPage.passwordLB);
		$(userMobile).attr("value","");
		
	}
	
	
	
	return {
		init:init,
		
	}
})();



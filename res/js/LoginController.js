var LoginController =  LoginController || {};

LoginController = (function(){
	
	var loginPageSel	= "#login-page";
	var loginBtSel		= '#loginBtn';
	var userID			= '#userIDInput';
	var userMobile 		= '#userMobileInput';
	
	var userIDVal; 
	var userMobileVal;
	
	function init(){
		
		$(loginPageSel).on("pagebeforeshow", function() {
			$(loginBtSel).disableButton();
		});		
		
		$(userID).on("keyup",function(){
			validateLoginInputs();
		});
		
		$(userMobile).on("keyup",function(){
			validateLoginInputs();
		});
		
	} // init()
	

	
	function localizeLoginPage(){
		
		//$(userID).attr("placeholder",Loc.loginPage.userIdLB);
		$(userID).attr("value","");
		
		//$(userMobile).attr("placeholder",Loc.loginPage.passwordLB);
		$(userMobile).attr("value","");
		
	}
	
	function validateLoginInputs(){
		var id = $(userID).val();
		var tel = $(userMobile).val();
		console.log(">: "+id+" "+tel);
		if(id !="" && tel.length == 10 ){
			$(loginBtSel).enableButton();
		}else{
			$(loginBtSel).disableButton();
		}
	}
	
	
	//login function
	function login(){
	
		userIDVal = $(userID).val();
		userMobileVal = $(userMobile).val();
		
		var body =  {
						PatientMobileNumber: userMobileVal
						,PatientIdentificationID: userIDVal 
					};
		
		//TODO: testing Date; remove next line
		body =  {PatientMobileNumber:"050431",PatientIdentificationID:"2123219111"};
		
		var request = new Req.RequestModel("loginCheck",body,loginSuccess,loginError);
		
		Req.sendRequest(request);
	}// login()
	
	function loginSuccess(response){
		ValidationController.startValidation("loginAuth",validateLoginSuccess,validateLoginError);
	}
	
	function loginError(response){
		//TODO: error dialog
		
		//TODO:testPath; remove next line
		App.setUserDetails("2123219111","050431","1111111");
		//ValidationController.startValidation("loginAuth",validateLoginSuccess,validateLoginError);
	}
	
	function validateLoginSuccess(response){
		
	}

	function validateLoginError(response){
		
	}	
	
	function getUserDetails(){
		var body =  {
						PatientMobileNumber: userMobileVal
						,PatientIdentificationID: userIDVal 
					};
		
		//TODO: testing Date; remove next line
		body =  {PatientMobileNumber:"050431",PatientIdentificationID:"2123219111"};
		
		var request = new Req.RequestModel("loginCheck",body,getUserDetailsSuccess,getUserDetailsError);
		
		Req.sendRequest(request);
	}
	
	function getUserDetailsSuccess(response){
	
	}
	
	function getUserDetailsError(response){
	
	}
	
	return {
		init:init
		,login:login
	}
})();


/*
		var jqxhr = $.ajax({
		  type: 'POST',
		  contentType: 'application/json',
		  dataType: 'json',
		  timeout: 120000,
		  processData: false,
		  url: "http://10.10.94.26/PatientInqueryData/Service1.svc/CheckPatientAuthorization",
		  data:  $.toJSON(x),
		  async:true
		})
		.success(function(data) { 
		
			console.log("\n\rsuccess:"+$.toJSON( data));
		})
		.error(function(result) { 
			console.log("error: "+$.toJSON( result))
			
		})
		.complete(function() { 
			console.log("complete");
		});
		
		if (ahmed === 0){
		
			ahmed = 1;
			console.log("firest");
			
			
		}else{
		
			console.log("second");
			
			var userPassword = $(userMobile).val();
			console.log("userPassword "+userPassword);
			
			var x =  {activationCode:userPassword,LanguageID:"1"};
		
			var jqxhr = $.ajax({
			  type: 'POST',
			  contentType: 'application/json',
			  dataType: 'json',
			  timeout: 120000,
			  processData: false,
			  url: "http://10.10.94.26/PatientInqueryData/Service1.svc/CheckActivationCode",
			  data:  $.toJSON(x),
			  async:true
			})
			.success(function(data) { 
			
				console.log("\n\rsuccess:"+$.toJSON( data));
			})
			.error(function(result) { 
				console.log("error: "+$.toJSON( result))
				
			})
			.complete(function() { 
				console.log("complete");
			});
		}
		
		http://spdev01/en/MediaCenter/news/_vti_bin/ListData.svc/Pages?$filter=Smartdevices eq true
		var x = { sendMessage:{doctorID:"4216",ProjectID:"12",ClinicID:"2",LanguageID:2}};
		
	    var jqxhr = $.ajax({
		  type: 'POST',
		  contentType: 'application/json',
		  dataType: 'json',
		  timeout: 120000,
		  processData: false,
		  url: "http://10.10.94.26:8080/PatientInQueryData/Service1.svc",
		  data:  $.toJSON(x),
		  async:true
		})
	    .success(function(data) { 
	    	
//	    	if(App.dev == true){
//	    		alert("success: "+$.toJSON( data));
//	    	}
	    	console.log("\n\rsuccess:"+$.toJSON( data));
	    	
	    	
	    })
	    .error(function(result) { 
	    	console.log("error: "+$.toJSON( result))
    		
	    })
	    .complete(function() { 
	    	console.log("complete");
	    });
	    
	    */
		




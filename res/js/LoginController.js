var LoginController =  LoginController || {};

LoginController = (function(){
	
	var loginPageSel	= "#login-page";
	
	
	var loginBtSel		= '#loginBtn';
	var userID			= '#userIDInput';
	var userMobile 		= '#userMobileInput';
	
	function init(){
		
		
		
		$(loginPageSel).on("pagebeforeshow", function() {
			App.setFirstTimeUser();
			localizeLoginPage();
			$(loginBtSel).disableButton();
		});		
		
		$(loginPageSel).on("pageshow", function() {
			
			//TODO: remove next line
			//AppoController.availableDrAppointments();

		});	
		
		$(userID).on("keyup",function(){
			console.log("skjhd");
			validateLoginInputs();
		});
		
		$(userMobile).on("keyup",function(){
			console.log("skjhd");
			validateLoginInputs();
		});
		
	} // init()
	

	
	function localizeLoginPage(){
		
		

		//$(".fist1").hide();
		//$(".appoTab").hide();
		$(".userloggingPanel").hide();
		$(".LoggedUserPanel").hide();
		
		$( "#left-panel" ).trigger( "updatelayout" );
		
		
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
	
	function loginSuccess(responce){
		$(loginBtSel).button('disable');
		
		var reqBody = {};
    	
    	DynamicAuthenticationController.sendRequestDynamicAuthentication("LoginService","Authenticate",reqBody, dynamicAuthSuccess, dynamicAuthError)

	}
	
	function loginError(response){
		if((response.status && response.status == -1) || (response.msg && response.msg.msgCode && response.msg.msgCode != "E001126")){
			App.showErrorDialog(response.msg.msgText);
		}else{
			$(userID).attr("placeholder",Loc.loginPage.userIdEr);
			$(userID).attr("value","");
			$("#userNameInputRow").addClass('costum-input-row-error');
			$("#userImg").attr("src","images/user_error.png");
			
			$(userMobile).attr("placeholder",Loc.loginPage.passwordEr);
			$(userMobile).attr("value","");
			$("#passwordInputRow").addClass('costum-input-row-error');
			$("#passwordImg").attr("src","images/password_error.png");
			
			$(loginBtSel).button('disable');
		}
	}
	
	
	//login function
	function login(){
		
		console.log("Login");
		//validate user name and password
 		var userName = $(userID).val();
		var userPassword = $(userMobile).val();
		
		$.support.cors = true;
		$.mobile.allowCrossDomainPages = true;
		
		
		/*
		sendMessage.PatientMobileNumber = this.txtMobileNo.Text;
                sendMessage.PatientIdentificationID = this.txtIqamaID.Text;
                sendMessage.Channel = PatienInQueryDataRef.Channel.Kiosk;
                sendMessage.ScreenName = this.ToString();
                sendMessage.Time = DateTime.Now.ToShortTimeString();
                sendMessage.LanguageID = (PatienInQueryDataRef.LanguageList)(SP.CurrentLanguageID);
                sendMessage.PatientTypeID = 1;
                sendMessage.PatientStatus = 2;
              
                sendMessage.ProjectID = Convert.ToInt16(SP.PojectID);
                sendMessage.ServiceName = (PatienInQueryDataRef.ServicesListNames)(SP.currentServiceName);
				
			*/	
		
		var x =  {PatientMobileNumber:"0500828299",PatientIdentificationID:"1066116672",PatientTypeID:1,PatientStatus:2,ProjectID:12};
		
	    var jqxhr = $.ajax({
		  type: 'POST',
		  contentType: 'application/json',
		  dataType: 'json',
		  timeout: 120000,
		  processData: false,
		  url: "http://10.10.94.101:1111/service1.svc/GetPatientService",
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
		
		/*
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
		
	}// login()
	
	
	
	return {
		init:init,
		login:login,
		
	}
})();





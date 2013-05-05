var LoginController =  LoginController || {};

//Note: this var must be global to be used within simpledialog2 plugin
var userNameTxSel 	= "#userNameInput";
var passwordTxSel 	= "#userPasswordInput";

LoginController = (function(){
	
	var loginPageSel	= "#login-page";
	var loginBtSel		= '#loginBtn';
	var registerBtSel	= "#registerBtn";
	var forgetLnkSel	= "#forgetLnk";
	var dontHaveAccountLB  ="#dontHaveAccountLB";
	
	
	var reLoginFlag 	= false;
	var logoutFlag 		= false;
	var reLoginMsg		= "";
	
	function init(){
		
		
		
		$(loginPageSel).on("pageinit", function() {
			$(loginBtSel).button('disable');
			$('input[type=text]').attr('autocomplete','off');
			$('input[type=text]').attr("autocorrect", "off");
			
		});		
		
		
		
		
		
        
		$(userNameTxSel).on("keypress" , function(evt) {
			
			var val = this.value;
		    evt = evt || window.event;
		    
		    var charCode = typeof evt.which == "number" ? evt.which : evt.keyCode;
		    
		    if (charCode && charCode > 32) {
		        var keyChar = String.fromCharCode(charCode);

		        // Transform typed character
		        var mappedChar = /[\u0660-\u0669]/.test(keyChar) ? String.fromCharCode(charCode - 1584) : keyChar;

		        var start, end;
		        if (typeof this.selectionStart == "number" && typeof this.selectionEnd == "number") {
		            // Non-IE browsers and IE 9
		            start = this.selectionStart;
		            end = this.selectionEnd;
		            this.value = val.slice(0, start) + mappedChar + val.slice(end);

		            // Move the caret
		            this.selectionStart = this.selectionEnd = start + 1;
		        }
		        this.value = this.value.replace(/['\s]/gi, '');
		        
		        return false;
		    }  
		        
		        
		});
        
        $(userNameTxSel).on("keyup" , function() {
        	
        
		});
        
		$(userNameTxSel).on("blur" , function() {
		    var username =$(userNameTxSel).val();
		    var password =$(passwordTxSel).val();
	        if(username && username.length>0){
	        	if(password && password.length>0){
	            	$(loginBtSel).button('enable');
	            }else{
	            	$(loginBtSel).button('disable');
	            	$(passwordTxSel).focus();
	            }
	        }else{
	        	$(loginBtSel).button('disable');
	        }
		});

		$(passwordTxSel).on("keyup" , function() {
			this.value = this.value.replace(/['\s]/gi, '');
			
		});
		
		$(passwordTxSel).on("blur" , function() {
		    var password =$(passwordTxSel).val();
		    var username =$(userNameTxSel).val();
		    
		    $(loginBtSel).button('disable');
		    
		    if(password && password.length>0 ){
		    	if( username && username.length>0){
		        	$(loginBtSel).button('enable');
		        }else{
		        	$(loginBtSel).button('disable');
		        	$(userNameTxSel).focus();
		        }
		    }

		});

	} // init()
	

	function localizeLoginPage(){
		
		$("#loginHeader").text(Loc.loginPage.login)
		$(dontHaveAccountLB).text(Loc.loginPage.dontHaveAccountLB);
		
		$(registerBtSel).changeButtonText(Loc.loginPage.registerBtn);
		$(loginBtSel).changeButtonText(Loc.loginPage.loginBtn);
		
		$(forgetLnkSel).changeButtonText(Loc.loginPage.forgetLnk);
		$("#canntRemUserPasLB").text(Loc.loginPage.forgetLB);
		
		$(loginPageSel).attr("dir",Loc.Dir);
		
		$(userNameTxSel).attr("placeholder",Loc.loginPage.userIdLB);
		$(userNameTxSel).attr("value","");
		$("#userNameInputRow").removeClass('costum-input-row-error');
		$("#userImg").attr("src","images/user.png");
		
		$(passwordTxSel).attr("placeholder",Loc.loginPage.passwordLB);
		$(passwordTxSel).attr("value","");
		$("#passwordInputRow").removeClass('costum-input-row-error');
		$("#passwordImg").attr("src","images/password.png");
		
		
		$("#footerTabLogin").text(Loc.tabBar.login);
		$("#footerTabBranches").text(Loc.tabBar.branches);
		$("#footerTabCurrency").text(Loc.tabBar.currency);
		$("#footerTabLanguage").text(Loc.tabBar.language);
		
	}
	
	function dynamicAuthSuccess(response){
				
		App.setLogedUser(true);
		if (App.TABLET)
    	{
        	$("#loginViewMenu").hide();
        	$("#optionsViewMenu").show();
    	}
		
		if (App.TABLET){
			App.changePage("#accounts-page", "flip");
		}else{
			App.changePage("#homeScreen-page", "flip");
		}
			
			
	}
	
	function dynamicAuthError(response){
		
		reLogin(response.msg.msgText);
		
//		App.showErrorDialog(response.msg.msgText);
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
			$(userNameTxSel).attr("placeholder",Loc.loginPage.userIdEr);
			$(userNameTxSel).attr("value","");
			$("#userNameInputRow").addClass('costum-input-row-error');
			$("#userImg").attr("src","images/user_error.png");
			
			$(passwordTxSel).attr("placeholder",Loc.loginPage.passwordEr);
			$(passwordTxSel).attr("value","");
			$("#passwordInputRow").addClass('costum-input-row-error');
			$("#passwordImg").attr("src","images/password_error.png");
			
			$(loginBtSel).button('disable');
		}
	}
	
	
	//login function
	function login(){
		
		$.mobile.changePage("#home");
		
		//validate user name and password
 		var userName = $(userNameTxSel).val();
		var userPassword = $(passwordTxSel).val();
		
	    
		
		//validate username and password from Server 
		//var result = DataContext.authUser(userName, userPassword,loginSuccess,loginError); 
	}// login()
	
	
	function reLogin(msg){
		
		App.setLogedUser(false);
		
		reLoginFlag 	= true;
		reLoginMsg		= msg;
		
		//$.mobile.changePage(loginPageSel);
		App.changePage(loginPageSel);
	}
	
	
	function logout(msg){
		App.setLogedUser(false);
		
		logoutFlag 	= true;
		reLoginFlag 	= false;
		reLoginMsg		= msg;
		
		//$.mobile.changePage(loginPageSel);
		App.changePage(loginPageSel);
	}
	
	
	function testAR(){
		App.startAR();
	}
	
	return {
		init:init,
		login:login,
		testAR:testAR,
		reLogin:reLogin,
		logout:logout
	}
})();
var ValidationController =  ValidationController || {};

ValidationController = (function(){
	
	var validationPageSel	= "#validate-page";
	var validationBtSel		= '#validateBtn';
	var code				= '#validationCodeInput';
	
	var successMethod;
	var errorMethod;
	var validationMethod;
	var noOfTries;
	
	function init(){

		$(validationPageSel).on("pagebeforeshow", function() {
			//$(code).attr("placeholder","");
			$(code).attr("value","");
			$(validationBtSel).disableButton();
			noOfTries = 0;
		});		
		
		
		$(code).on("keyup",function(){
			validateUserInputCode();
		});
		
	} // init()
	
	
	function validateUserInputCode(){
		var codeVal = $(code).val();
		console.log("validateUserInputCode>: "+codeVal);
		if(codeVal !="" && codeVal.length == 4 ){
			$(validationBtSel).enableButton();
		}else{
			$(validationBtSel).disableButton();
		}
	}
	
	
	function validate(){
		console.log("validate");
 		
		var body =  { activationCode:$(code).val()};
		
		var request = new Req.RequestModel(validationMethod,body,validateSuccess,validateError);
		
		Req.sendRequest(request);
	}
	
	function validateSuccess(response){
		sucessMethod(response);
	}

	function validateError(response){
		noOfTries +=1;
		if(noOfTries >2 ){
			errorMethod(response);
		}else{
			$(code).attr("value","");
			$(validationBtSel).disableButton();
			//TODO: error Dialog
		}
	}	
	
	function startValidation(method, success, error){
		sucessMethod = success;
		errorMethod	= error;
		validationMethod = method;
	
		$.mobile.changePage("#validate-page");
	}
	
	return {
		init:init
		,validate:validate
		,startValidation:startValidation
	}
})();
var Req = Req || {};

var wsUrl = "http://10.10.94.26/";

var serviceLang = {};	serviceLang["en"] = "0";	serviceLang["ar"] = "1";

var services = {};

services["loginCheck"]		='PatientInqueryData/Service1.svc/REST/CheckPatientAuthorization';
services["loginAuth"]		='PatientInqueryData/Service1.svc/REST/CheckActivationCode';
services["PateintAppoiments"]		='DoctorAppointmentServices/Service1.svc/PateintHasAppoiment';



Req.RequestModel = function(ReqAction, ReqBody, success, error){
	
	this.url 	= wsUrl + services[ReqAction];
	
	this.Body 	= ReqBody;
	this.Body.LanguageID = serviceLang[App.LANG];
	this.Body.stamp	= new Date();
	
	this.success = success;
	this.error	= error;
}

Req.sendRequest = function(requestModel){
	
	console.log("\n\rRequesr: "+$.toJSON( requestModel.Body));
	
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
		
	var jqxhr = $.ajax({
		  type	: 'POST',
		  contentType: 'application/json',
		  dataType: 'json',
		  timeout: 120000,
		  url	: requestModel.url,
		  data	: $.toJSON(requestModel.Body),
		  async	:true
		})
	    .success(function(data) { 
	    	
	    	console.log("\n\rsuccess:"+$.toJSON( data));
	    	
	    	var result = data;
	    	
	    	if(result.Dataw == false){
	    		requestModel.error(result);
	    		
	    	}else if (result.Dataw == true){
	    		requestModel.success(result);
	    	}
	    })
	    .error(function() { 
	    	console.log("\n\error");
	    	var result = {
				    		status	: -1,
				    		//msg		:{msgCode:"",msgType:"",msgText:Loc.msg.networkError}
				    	};
	    	requestModel.error(result);
	    })
	    .complete(function() { 
			console.log("\n\complete");
	    });
}

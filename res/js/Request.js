var Req = Req || {};

var wsUrl = "http://10.0.2.147/ibr-smart/SmartServlet";

Req.demoMode = false;


Req.RequestModel = function(ReqService, ReqAction, ReqBody,ReqSubAction){
	
	if(Req.demoMode == true){
		this.Header = {
				service : ReqService,
				action : ReqAction,
				subaction : ReqSubAction,
				lang : 'en',	
//				lang : App.LANG,
			} ;
	}else{

	
			
		}
		this.Header = {
				service : ReqService,
				action : ReqAction,
				subaction : ReqSubAction,
				lang : App.LANG,
				stamp: new Date()
			} ;
	}
	
	
	this.Body = ReqBody;
}

Req.LoginRequestModel = function(ReqService, ReqAction, ReqBody,ReqSubAction){
	
	if(Req.demoMode == true){
		this.Header = {
				service : ReqService,
				action : ReqAction,
				subaction : ReqSubAction,
				lang : 'en',	
			} ;
	}else{
		this.Header = {
				service : ReqService,
				action : ReqAction,
				subaction : ReqSubAction,
				lang : App.LANG,
				stamp: new Date()
			} ;
	}
	
	
	this.Body = ReqBody;
}

Req.ResultModel = function(config){
	this.status = config.status;
	this.msg = config.msg;
	this.result = config.result;
}

Req.sendRequest = function(requestModel,success,error,options){
	
//	alert($.toJSON(requestModel));
	//TODO: for testing
//	if(App.dev == true){
////		wsUrl = "http://192.168.150.1:8085/ibr-smart/SmartServlet";
//	}
//	return;
	//End

	
	console.log("\n\rRequesr: "+$.toJSON( requestModel.Header)+"\n\r"+$.toJSON(requestModel.Body));
	
	if(Req.demoMode == true){
		console.log(a[$.toJSON( requestModel.Header)]);
		success($.evalJSON(a[$.toJSON( requestModel.Header)]));
		return;
	}
	if(options && options == true){
		
	}else{
		//alert($.toJSON( requestModel.Header))
		Req.block();
		
	}
	
	$.support.cors = true;
//	$.mobile.allowCrossDomainPages = true;
	var jqxhr = $.ajax({
		  type: 'POST',
		  timeout: 120000,
		  url: wsUrl,
		  data: { Header:$.toJSON(requestModel.Header),Body:$.toJSON(requestModel.Body)},
		  async:true
		})
	    .success(function(data) { 
	    	
//	    	if(App.dev == true){
//	    		alert("success: "+$.toJSON( data));
//	    	}
	    	console.log("\n\rsuccess:"+$.toJSON( data));
	    	
	    	var result = new Req.ResultModel(data);
	    	if(options && options == true){
	    		
	    	}else{
	    		//alert($.toJSON( data))
	    		if(result.status==0 && App.preventUnBlock==true){
	    			console.log("error unblock")
		    		App.preventUnBlock=false;
	    		}
	    		Req.unBlock();
	    	}

	    	if(result.status == 0){
	    		if(result.msg && result.msg.msgCode && result.msg.msgCode == "SMRT0001"){
	    			// TimeOut => should ReLogin
	    			
	    			LoginController.reLogin(result.msg.msgText);
	    		}else{
	    			
	    			error(result);
	    		}
	    		
	    	}else if (result.status == 1){
	    		success(result);
	    	}

	    	
	    })
	    .error(function() { 
	    	console.log("error unblock")
    		App.preventUnBlock=false;
	    	if(options && options == true){
	    		
	    	}else{
	    		
	    		Req.unBlock();
	    		
	    	}
	    	
	    	var result = new Req.ResultModel({
				    		status	: -1,
				    		msg		:{msgCode:"",msgType:"",msgText:Loc.msg.networkError}
				    			});
	    	error(result);
	    })
	    .complete(function() { 
//	    	alert("complete"+$.toJSON(result));
//	    	App.cancelWait();
//	    	$.unblockUI();
	    	
	    });
	
//	$.mobile.hidePageLoadingMsg();
//	App.cancelWait();
//	return result;
//	alert("end Synch");
}

Req.requestsNum = 0;

Req.block = function (){

	

	if(Req.requestsNum < 1){
	    $('#cust-block-ui').show();
	    
	    if(App.TABLET){
	  //  	$('#cust-back-menu').show();
	    	$('#cust-block-ui-main').show();
	    }
		if(isMobile.Windows()){
			$.mobile.loading('show',{html:"<img src='images/loading.png'/ style='opacity:1'>"});}
		else
			$.mobile.loading('show',{html:"<img src='images/ajax-loader.gif'/ style='opacity:1'>"});
		App.loading = true;

	}
	console.log("block")
	console.log("REQ num= "+Req.requestsNum);
	
	Req.requestsNum +=1;
	
//	if(Req.requestsNum < 1){
//		if(isMobile.Windows()){
//			$.blockUI({ 
//				message: '<img src="images/loading.png" />', 	
//				css: { 
//					top:  ($(window).height() - (75)) /2 + 'px', 
//					left: ($(window).width() - (75)) /2 + 'px', 
//					width: (75)+'px',
//	        		border: 'none',
//					backgroundColor: 'transparent'
//				} ,
//				overlayCSS:  {
//					backgroundColor: '#1e1e1e',
//					opacity:		 0.8,
//					cursor:			 'wait'
//				}
//			});
//		}
//		else{
//
//			$.blockUI({ 
//				message: '<img src="images/ajax-loader.gif" />', 	
//				css: { 
//					top:  ($(window).height() - (151)) /2 + 'px', 
//					left: ($(window).width() - (151)) /2 + 'px', 
//					width: (151)+'px',
//	        		border: 'none',
//					backgroundColor: 'transparent'
//				} ,
//				overlayCSS:  {
//					backgroundColor: '#1e1e1e',
//					opacity:		 0.8,
//					cursor:			 'wait'
//				}
//			});
//		}
//	}
	
//	Req.requestsNum +=1;
}

Req.unBlock = function (){
	console.log("unblock called")
	console.log("preventUnBlock= "+App.preventUnBlock);
	Req.requestsNum -=1;
	if(!App.preventUnBlock){
		console.log("unblock inside")	
		if(Req.requestsNum < 1){
	    	$.mobile.loading('hide');
	    	App.loading = false;
			$('#cust-block-ui').hide();
			if(App.TABLET){
	    	//   	$('#cust-back-menu').hide();
	    		$('#cust-block-ui-main').hide();
	    	}

		}
	}
	console.log("REQ num= "+Req.requestsNum)
	App.preventUnBlock=false;
//	Req.requestsNum -=1;
//	if(Req.requestsNum < 1){
//		$.unblockUI();
//	}
	
}


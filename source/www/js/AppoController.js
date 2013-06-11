var AppoController =  AppoController || {};
console.log("djklhld");
AppoController = (function(){
	
	var appoPageSel	= "#appo-page";
	var $appoList= $("#appoList");
	var $emptyAppoListDiv	= $("#emptyAppoList");
	
	var userAppoList = [];
	
	var appoDetailsPageSel = "#appoDetails-page";
	var tempAppo ={};
	
	function init(){
		
		$(appoPageSel).on("pagebeforeshow", function() {
			retrieveUserAppomtments();
			//$appoList.hide();
			//$emptyAppoListDiv.show();
			$emptyAppoListDiv.hide();
		});		
		
		$(appoDetailsPageSel).on("pagebeforeshow", function() {
			$("#appoDetailsHeader").text(tempAppo.title);
			$("#appoDetailsTitle").text(tempAppo.title);
			$("#appoDetailsDr").text(tempAppo.dr.title+tempAppo.dr.name);
			$("#appoDetailsDate").text(tempAppo.date);
			$("#appoDetailsTime").text(tempAppo.time);
			$("#appoDetailsProject").text(tempAppo.project);
			
			$("#appoDetailsMapDiv").empty().append('<img style="border: 4px solid gray; width: 90%;" src="http://maps.googleapis.com/maps/api/staticmap?center='+tempAppo.lat+','+tempAppo.lang+'&zoom=17&size=655x750&maptype=roadmap&markers=color:blue%7Clabel:H%7C'+tempAppo.lat+','+tempAppo.lang+'&sensor=false" />');
			
		});		
		
	} // init()
	

	function retrieveUserAppomtments (){
		var list = [{title:"Examination Title",dr:{name:"Mohamed Ahmed Habib",title:"Dr."},time:"3:30 AM",date:"15/5/2013",project:"Aulaya",lat:"24.706767",lang:"46.675417"},
					{title:"Examination Title",dr:{name:"Mohamed Ahmed Habib",title:"Dr."},time:"3:30 AM",date:"15/5/2013",project:"Aulaya"}];
					
		userAppoList = list;
		displayUserAppointments(list);
	}
	
	function displayUserAppointments(appointments){
		$appoList.empty();
		var html = "";
		var len = appointments.length;
		if (len == 0) {
			$emptyAppoListDiv.show();
			return;
		}else{
			for(var i =0 ; i < len; i++){
				var appo = appointments[i];
				var li = 	'<li data-icon="false" style="" onclick="AppoController.displayAppoDetails('+i+')" >'
								+'<div style="border:1px solid #528EBF;background-color:white;">'
									+'<table cellspacing="3px" style="width: 100%;" ><tbody>'
										+'<tr >'
											+'<td style="" colspan="3">'
												+'<img class="app-bill-img"  src="img/alarm_off.png">'
												+'<div>'
													+'<div class="appoTitle">'+appo.title+'</div>'
													+'<div class="appoDrName">'+appo.dr.title+appo.dr.name+'</div>'
												+'</div>'
												+'<hr class="splitter loginFormSplitter">'
											+'</td>'
										+'</tr>'
										+'<tr>'
											+'<td style="">'
												+'<img class="app-cal-img"  src="img/cal.png">'
												+'<div class="appoDetails">'+appo.date+'</div>'
											+'</td>'
											+'<td style="">'
												+'<img class="app-cal-img"  src="img/clock.png">'
												+'<div class="appoDetails">'+appo.time+'</div>'
											+'</td>'
											+'<td style="">'
												+'<img class="app-cal-img"  src="img/pin.png">'
												+'<div class="appoDetails">'+appo.project+'</div>'
											+'</td>'
										+'</tr>'
									+'</tbody></table>'
								+'</div>'	
							+'</li>';
				html += li;
			}
		}
		
		$appoList.append(html).listview('refresh');
	}
	
	
	function displayAppoDetails(index){
		tempAppo = userAppoList[index];
		$.mobile.changePage("#appoDetails-page");
	}
	
	function searchAppointments(){
		$.mobile.changePage("#appoSearchResult-page");
	}
	
	function availableDrAppointments(){
		$.mobile.changePage("#drAppo-page");
	}
	
	return {
		init:init
		,displayAppoDetails:displayAppoDetails
		,searchAppointments:searchAppointments
		,availableDrAppointments:availableDrAppointments
	}
})();


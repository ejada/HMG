var AppoController =  AppoController || {};

AppoController = (function(){
	
	var appoPageSel	= "#appo-page";
	var $appoList= $("#appoList");
	var $emptyAppoListDiv	= $("#emptyAppoList");
	
	function init(){
		
		$(appoPageSel).on("pagebeforeshow", function() {
			retrieveUserAppomtments();
			$appoList.hide();
			$emptyAppoListDiv.show();
		});		
		
	} // init()
	

	function retrieveUserAppomtments (){
		var list = [{title:"Examination Title",dr:{name:"Mohamed Ahmed Habib",title:"Dr."},time:"3:30 AM",date:"15/5/2013",project:"Aulaya"},
					{title:"Examination Title",dr:{name:"Mohamed Ahmed Habib",title:"Dr."},time:"3:30 AM",date:"15/5/2013",project:"Aulaya"}];
		displayUserAppointments(list);
	}
	
	function displayUserAppointments(appointments){
		$appoList.empty();
		var html = "";
		var len = appointments.length;
		if (len == 0) {
			$emptyAppoListDiv.show();
			return;
		}elss{
			for(var i =0 ; i < len; i++){
				var appo = appointments[i];
				var li = 	'<li data-icon="delete" style="" onclick="AppoController.displayAppoDetails('+i+')" >'
								+'<div style="border:1px solid #528EBF;background-color:white;margin-right:10px;">'
									+'<table cellspacing="3px" style="width: 100%;" ><tbody>'
										+'<tr >'
											+'<td style="" colspan="3">'
												+'<img class="app-bill-img"  src="img/bill.png">'
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
	
	return {
		init:init		
	}
})();


var StaffController =  StaffController || {};

StaffController = (function(){
	
	var staffPageSel	= "#staff-page";
	var $staffList	= $("#staffList");
	var staffList 	=[];
	
	var drProfilePageSel = "#drProfile-page";
	var tmpDrProfile ={};
	
	function init(){
		
		
		
		$(staffPageSel).on("pagebeforeshow", function() {
		
			retrieveMyDrsList();
		});	

		$(drProfilePageSel).on("pagebeforeshow", function() {
		
			$("#drProfileHeader").text(tmpDrProfile.title+tmpDrProfile.name);
			$("#drProfileName").text(tmpDrProfile.title+tmpDrProfile.name);
			$("#drProfileDept").text(tmpDrProfile.dept);
			$("#drProfileDesc").text(tmpDrProfile.desc);
			$("#drProfileProf").append(tmpDrProfile.lDesc);
		});	
		
	} // init()
	

	function retrieveMyDrsList(){
		var list = [{name:"Mohamed Ali Habib", title:"Dr.",dept:"Department",desc:"A little description about dr", img:"img/dr.png",lDesc:"A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA <br><br>description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about Dr<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>"},
					{name:"Mohamed Ali Habib", title:"Dr.",dept:"Department",desc:"A little description about dr", img:"img/dr.png",lDesc:"A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA <br><br>description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about Dr<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>"},
					{name:"Mohamed Ali Habib", title:"Dr.",dept:"Department",desc:"A little description about dr", img:"img/dr.png",lDesc:"A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA <br><br>description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about Dr<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>A description about Dr A description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA description about DrA<br>"}];
		staffList = list;
		displayMyDrsList(list);
	}
	
	function displayMyDrsList(drs){
		$staffList.empty();
		var html = "";
		var len = drs.length;
		console.log("sflkj"+len);
		if (len == 0) {
			
		}else{
			for(var i =0 ; i < len; i++){
				var item = drs[i];
				var li = 	'<li style="" data-icon="disclosure-icon" >'
								+'<a href="#" onclick="StaffController.openDrProfile('+i+');" class="dr-cell">'
									+'<img src="'+item.img+'">'
									+'<div>'
										+'<div class="drs-name">'+item.title+item.name+'</div>'
										+'<div class="drs-details">'+item.dept+'</div>'
										+'<div class="drs-details">'+item.desc+'</div>'
									+'</div>'
								+'</a>'
							+'</li>';
				html += li;
			}
		}
		
		$staffList.append(html).listview('refresh');
	}
	
	
	function openDrProfile(index){
		tmpDrProfile = staffList[index];
		$.mobile.changePage(drProfilePageSel);
	}
	
	return {
		init:init
		,openDrProfile:openDrProfile
	}
})();

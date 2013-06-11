var MapController = MapController || {};
var DataContext = DataContext || {};
MapController = (function(){
	
	//******** Global Var*****************
	
	var cityBranches = {};
	var staticMapBranch = {};
	
	var currentPosMarker={};
	var watchID;
	
	var markersArray = [];
	var mapSelectCitiesList = [] ;
	
	var mapMode	= 0;
	var prevMapMode = 0;
	var selectedCityName = "";
	var mapIsCreated = false;
	var mapFilter	= [1,1,1,1];
	
	var destination =1;
	
	var directionDisplay = {};
	
	var positioningIsActive = false
	var defaultCity		= {"cityId":1,"Desc":"Riyadh","coordinatesLat":"24.657955","coordinatesLng":"46.720000","zoom":11};
	
	var icons = ["img/pin_atm.png","img/pin_atm2.png","img/pin_branch_m.png","img/pin_branch_fm.png"];
	
	//************************************
	
	var searchLocationsPageSelc = "#searchLocations-page";
	var branchesSelcListSelc 	= "#branchesSelcList";
	var atmSelcListSelc			="#atmSelcList";
	
	var cityLBSelc		="#cityLB";
	var branchesLBSelc	="#branchesLB";
	var atmLBSelc		="#atmLB";
	
	var mapSelc = '#map_canvas';
	var mapHeaderSelc	= "#mapPageHeader";
	
	
	 
	function init(){
		
			$("#mapLocationDetails-page").on("pagebeforeshow", function(e, data){
	        	
				$("#locationDetailsHeader").text("Locations");
//				$("#mapLocationTypeLB").text(Loc.mapPage.type);

				if ($.mobile.pageData && $.mobile.pageData.id){
					
					
					var branch = markersArray[$.mobile.pageData.id];
					
					console.log(branch.coordinatesLat+','+branch.coordinatesLng+','+branch.bank);
					
					$("#locationTitle").text(branch.bank);
					
					var location 	= "ATM";
					var branchType 	= (branch.GentlementsFlag == 0)?"Men":"ladies";
					var type 		= branch.type;
					var deposit 	= "<lable id='mapLocationDeposit' ><lable id='mapLocationDepositLB'>deposit: </lable>"+branch.deposit+"</lable>";
					var tel 		= "";
					$("#mapLocationsDetails-content").empty();
					
					if(branch.branchOrAtm == 1){
						location 	= "branch";
						type 		= branchType;
						deposit 	= "";
						tel			= "<li data-icon='false' ><a >"
						    			+"<img src='img/phone.png' class='mapLocationDetailsImgs'>"
						    			+"<div class='mapLocationDetails'>"+branch.phoneNum+"</div>"
						    			+ "</a></li><hr class='splitter' >";
					}
					
					var ul = $("<ul id='mapLocationDetailsList' data-theme='custom' data-role='listview' ><hr class='splitter' ></ul>").appendTo("#mapLocationsDetails-content");
			    	
					$("<li data-icon='false' ><a >"
							+"<div id='map_square' style='float:left' > <img src='http://maps.googleapis.com/maps/api/staticmap?center="+branch.coordinatesLat+", "+branch.coordinatesLng 
					    		+"&zoom=12&size=170x170&maptype=roadmap&markers=color:red%7Clabel:I%7C"+branch.coordinatesLat+", "+branch.coordinatesLng
					    		+"&sensor=false'></div>"
		    				+"<div style='text-align:center; margin-top:30px;'>" 
		    					+"<div id='mapLocationBranchOrAtm'>"+location+"</div>"
		    					+"<div id='mapLocationType'>"+type+"</div>"
		    					+"<div>"+deposit+"</div>" 
		    					+"</div>"
			    	+ "</a></li><hr class='splitter' >"
			    	+ "<li data-icon='false' ><a >"
			    			+"<img src='img/location.png' class='mapLocationDetailsImgs'>"
			    			+"<div class='mapLocationDetails' >"+branch.area+"</div>"
			    			+"<div class='mapLocationDetails'>"+branch.street+"</div>"
			    	+ "</a></li><hr class='splitter' >"
			    	+ tel
			    	+"<li data-icon='false' >"
	    				+'<input data-theme="custom-button-2" id="showDirBt" type="button" data-mini="true"  onclick="MapController.showDir('+$.mobile.pageData.id+');"  value="direction" ></input>'
	    			+ "</li><hr class='splitter' >"
	    			+"<li data-icon='false' >"
    					+'<input data-theme="custom-button-2" id="startARBt" type="button" data-mini="true"  onclick="App.startAR(\''+branch.coordinatesLat+'\',\''+branch.coordinatesLng+'\',\''+branch.bank+'\');"  value="ar" ></input>'
    				+ "</li><hr class='splitter' >"
					).appendTo(ul);
					$("#showDirBt").button();
					$("#startARBt").button();
			    	ul.listview();
 	             }
				
	        });
		
			
			
			$( '#page-map' ).on( 'pagebeforecreate',function(event){ 
				html = '<div data-role=controlgroup id=mapFilter data-theme="custom-radio" >'
							+'<label for=mapFilter1 class="mapFilterTxt">allBranches</label>'
							+'<input type=radio id=mapFilter1 name=mapFilter value=1 checked="checked" />'
							+'<label for=mapFilter2 class="mapFilterTxt">men</label>'
							+'<input type=radio id=mapFilter2 name=mapFilter value=2 />'
							+'<label for=mapFilter3 class="mapFilterTxt">ladies</label>'
							+'<input type=radio id=mapFilter3 name=mapFilter value=3 />'
							+'<label for=mapFilter4 class="mapFilterTxt">allATM</label>'
							+'<input type=radio id=mapFilter4 name=mapFilter value=4 />'
							+'<label for=mapFilter5 class="mapFilterTxt">deposit</label>'
							+'<input type=radio id=mapFilter5 name=mapFilter value=5 />'
							+'<label for=mapFilter6 class="mapFilterTxt">nonDeposit</label>'
							+'<input type=radio id=mapFilter6 name=mapFilter value=6 />'
						+'</div>';
				$("#filterDiv").append(html);
			});
			
			$("#mapFilter").on('change', function(event) {
				console.log($("input[name*=mapFilter]:checked").attr("value"));
				var select = $("input[name*=mapFilter]:checked").attr("value");
				
				if(select == 1){
					mapFilter	= [1,1,0,0];
				}else if(select == 2){
					mapFilter	= [1,0,0,0];
				}else if(select == 3){
					mapFilter	= [0,1,0,0];
				}else if(select == 4){
					mapFilter	= [0,0,1,1];
				}else if(select == 5){
					mapFilter	= [0,0,1,0];
				}else if(select == 6){
					mapFilter	= [0,0,0,1];
				}
				
				addBranchesMarkers(markersArray);
			});
			
			$('#page-map').on("pagecreate", function() {
				mapFilter	= [1,1,0,0];
				
			});
			

			$('#page-map').on("pagebeforeshow", function() {
	
				$(mapHeaderSelc).text("Locations");
				$("#mapHomeBtn").changeButtonText("City");
				
				var h = $(window).height() -80; 
				console.log("H: "+h)
				$(mapSelc).css("height", h);
				
				if(mapSelectCitiesList && mapSelectCitiesList.length>0){
					renderFilterCitiesList();
				}else{
					DataContext.getMapCitiesNames(getCitiesNamesSuccess,getCitiesNamesError);
				}
//				refreshFooter();
				
				positioningIsActive = true;
//				TabBarController.activateTab(2);
			});
			
			$('#page-map').on("pagehide", function() {
				positioningIsActive = false;
				if ( navigator.geolocation ){
					navigator.geolocation.clearWatch(watchID);
//					$(mapSelc).gmap('destroy');
				}
				
			});
			
			$("#mapCityList").on('change', function(event) {
				var city = $("#mapCityList").val();
				mapMode = 1;
				getCityDetails([city]);
			});

			$('#page-map').on("pageshow", function() {

//				return;
//				$.mobile.urlHistory.stack.length = 0;
				
				//create map centered to city center
				createMap(defaultCity);
//				return;
				if( mapMode == 0){
					
					// Get current location
					if ( navigator.geolocation ) { 
//					     fadingMsg(Loc.mapPage.usingDeviceMsg); 							//Using device geolocation to get current position.
					     navigator.geolocation.getCurrentPosition (
					    		 function(position) {
						        	 // getCurrentLocation Success
						        	 // get CityName by Lat&Lang and retrive its branches from server 
						        	 codeLatLng(position.coords.latitude, position.coords.longitude);
					        	 },
					        	 function(positionErr){ 
					        		//Couldn't get current position.
									locationDetectionFaild();
									 //Show default City
							    	 showDefaultCity();
								 },
								 { 
									maximumAge: 3000, 
									timeout: 50000, 
									enableHighAccuracy: true 
									}
								); 
					} else {
						//Couldn't get current position.
						locationDetectionFaild();
						 //Show default City
				    	 showDefaultCity();
					}
				}else if(mapMode == 1){								// Selected City Mode
					getCityDetails([selectedCityName]);
				}else if(mapMode == 2){								// Route Mode
					
					routeToMarker();
					
				} 
				            
			});
			
			
		}//End: init()
	
	function routeToMarker(){
//		$("#mapHomeBtn").changeButtonText(Loc.msg.cancel);
		$("#cancelroute").css("display","block");
		$("#nearsestBtn").css("display","none");
		$("#menuFilterBtn").css("display","none");
		
		navigator.geolocation.getCurrentPosition ( 
	            function(position) {
	            	
	            	var branch = markersArray[destination];
	            	$(mapSelc).gmap('clear', 'markers');
	        		$(mapSelc).gmap('refresh');	
	        		
	        		$(mapSelc).gmap('displayDirections', 
		                { 'origin' : new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
		                  'destination' :  new google.maps.LatLng(branch.coordinatesLat, branch.coordinatesLng), 
		                  'travelMode' : google.maps.DirectionsTravelMode.DRIVING
		                },
		                { },
	                    function (result, status) {
	                          if (status === 'OK') {
	                              var center = result.routes[0].bounds.getCenter();
	                              directionDisplay = result;
	                              $(mapSelc).gmap('option', 'center', center);
	                              $(mapSelc).gmap('refresh')
	                          } else {
	                              fadingMsg("Error");		//Unable to get route
	                          }
	                    });   
	        		
	        		addCurrentPosMarker();
	        		
	                }, 
	                function(){ 
	                	 fadingMsg("Error");		//Couldn't get current position.
	                }); 
	}
	
	function showDir(branchId){
		destination = branchId;
		prevMapMode = mapMode;
		mapMode = 2;
		window.history.go(-1);
	}
	
	
	function showDefaultCity(){
		getCityDetails([defaultCity.Desc]);
	}
	
	function renderMapCitiesList(){
		$("#selectMapCity-content").empty();
		
		if (mapSelectCitiesList) {
			var html = "<ul id='mapCitiesList' data-theme='custom' data-role='listview' ><hr class='splitter' >";

			for ( var i = 0; i < mapSelectCitiesList.length; i++) {
				var city = mapSelectCitiesList[i];
//				alert(city.enDesc);
//				alert(city.code);
				html += 
						"<li  ><a href='#' onclick='MapController.loadCity(\""+city.code+"\");' >"
				    	+ "<div class='white' >"+city.value+"</div>" 
				    	+ "</a></li><hr class='splitter' >"
			}

			html += '</ul>';

			$("#selectMapCity-content").append(html);
			$("#mapCitiesList").listview();
		}
	}
	
	
	function getCitiesNamesSuccess(response){
		mapSelectCitiesList = response.result;
		renderFilterCitiesList();
//		renderMapCitiesList();
	}
	
	function getCitiesNamesError(){
		App.showErrorDialog(response.msg.msgText);
	}
	
	
	function loadCity(cityName){
		mapMode = 1;
		selectedCityName = cityName;
		parent.history.back();
	}
	
	function codeLatLng(lat, lng) {
		
//		alert("getCityNameByLatLang");
		
		var namesList = [];
		var geocoder = new google.maps.Geocoder();
	    var latlng = new google.maps.LatLng(lat, lng);
	    geocoder.geocode({'latLng': latlng,'region':'en'}, function(results, status) {
	      if (status == google.maps.GeocoderStatus.OK) {
	      console.log(results)
	        if (results[1]) {
	             for (var i=0; i<results[0].address_components.length; i++) {
	            	 for (var b=0;b<results[0].address_components[i].types.length;b++) {

		            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
		                if (results[0].address_components[i].types[b] == "locality") {
		                    //this is the object you are looking for
		                    namesList.push(results[0].address_components[i].short_name);	
		                    console.log("LOCALITY: "+results[0].address_components[i].short_name)
		                }
//		                else if(results[0].address_components[i].types[b] == "administrative_area_level_1"){
//		                	 namesList.push(results[0].address_components[i].short_name);
//		                }else if(results[0].address_components[i].types[b] == "sublocality"){
//		                	 namesList.push(results[0].address_components[i].short_name);
//		                }
	            	 }
	             }
	             //getCity Branches from server
	             getCityDetails(namesList);
	        } else {
	        	//cann't get city name ->
	        	locationDetectionFaild();		//  Couldn't get current position. Show default City
	        }
	      } else {
	    	  //cann't get city name ->
	    	  locationDetectionFaild();			//Couldn't get current position.
	      }
	    });
	  }
	
	function createMap(city){
		console.log("5");
//		$(mapSelc).gmap('destroy');
		if(!google.maps.LatLng){
			homepage.reloadMapAPI();
			return;
		}
		console.log(google.maps.LatLng);
		if(!mapIsCreated){
			console.log("6: "+city.coordinatesLat+" "+city.coordinatesLng+" "+city.zoom);
			//create map centered to city center
			$(mapSelc).gmap({'center' :new google.maps.LatLng(city.coordinatesLat, city.coordinatesLng), 
				'zoom' : city.zoom,
				'mapTypeControl' : true, 
				'navigationControl' : false,
				'streetViewControl': false,
				}); 
			console.log("7.0");
			// add map controles
			var locz = $('<img src="img/cur.png" style="height:60px;margin:5px;" onclick="MapController.posBtnClicked();">');
			var menu = $('<img id="menuFilterBtn" src="img/mapmenu.png" style="height:25px;margin:5px;" onclick="MapController.openFilterDiv();">');
			var cncl = $('<img id="cancelroute" src="img/redclear.png" style="height:60px;margin:5px;display:none;" onclick="MapController.cancelRouteMode();">');
			var near = $('<img id="nearsestBtn" src="img/nearest-loc.png" style="height:60px;margin:5px;" onclick="MapController.findNearestMarker();">');
			// //$(mapSelc).gmap('addControl', menu, google.maps.ControlPosition.RIGHT_BOTTOM);
			//$(mapSelc).gmap('addControl', locz, google.maps.ControlPosition.LEFT_BOTTOM);
			//$(mapSelc).gmap('addControl', cncl, google.maps.ControlPosition.TOP_LEFT);
			//$(mapSelc).gmap('addControl', near, google.maps.ControlPosition.LEFT_BOTTOM);
//			locz.css("display","none");
//			$(mapSelc).gmap('refresh');
			console.log("7");
			mapIsCreated = true;
		}else{
			console.log("8");
			$(mapSelc).gmap('refresh');
			$(mapSelc).gmap('option', 'center', new google.maps.LatLng(city.coordinatesLat, city.coordinatesLng));
			
//			$('#map_canvas').gmap('clear', 'markers');
		}
		
	}
	
	function locationDetectionFaild(){

    	 fadingMsg("Error");		//Couldn't get current position.
	}
	
	function rad(x) {return x*Math.PI/180;}
	function findNearestMarker( ) {
		
		navigator.geolocation.getCurrentPosition ( 
	            function(position) {
	            	nearest(position.coords.latitude , position.coords.longitude);
	            	
	                }, 
	                function(){ 
	                	 fadingMsg("Error");		//Couldn't get current position.
	                }
		); 
	    
	}
	
	function nearest(lat , lng){
		
		console.log("CUR >>>>> LAT: "+lat+" LANG: "+lng);
		
		var R = 6371; // radius of earth in km
	    var distances = [];
	    var closest = -1;
	    
	    var markers = markersArray;
	    
	    var i  = markers.length-1;
	    do{
	    	var branch = markers[i];
	    	if((mapFilter[0]==1 && branch.GentlementsFlag == 0)||(mapFilter[1]==1 && branch.GentlementsFlag == 1)||(mapFilter[2]==1 && branch.depositFlag == 1)||(mapFilter[3]==1 && branch.depositFlag == 0)){
				
	    		var mlat = branch.coordinatesLat;
		        var mlng = branch.coordinatesLng;
		        var dLat  = rad(mlat - lat);
		        var dLong = rad(mlng - lng);
		        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
		        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		        var d = R * c;
		        
		        console.log(" "+i+": >>>> LAT: "+lat+" LANG: "+lng+" <<<<< D: "+d);
		        
		        distances[i] = d;
		        if ( closest == -1 || d < distances[closest] ) {
		            closest = i;
		        }
		        
			}
	    	
	    }while(i--);
	    	
	    	    
	    openBrancheDetailsView(closest);
	}
	
	
	function addCurrentPosMarker(){
		//add current position marker
		if ( navigator.geolocation ) { 
			watchID = navigator.geolocation.watchPosition ( 
			         function(position) {
			        	if(positioningIsActive != true){
			        		navigator.geolocation.clearWatch(watchID);
			        		return;
			        	}
			        	console.log("newPos: "+positioningIsActive);
						var marker = $(mapSelc).gmap('get', 'markers')['currentPos'];
						if(marker){
							marker.setPosition( new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
						}else{
							console.log("new Ps");
							$(mapSelc).gmap('addMarker', 
									{ 'position'	: new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
									  'animation' 	: google.maps.Animation.DROP,
									  'id'			:'currentPos',
									  'icon'		: {
										    path: google.maps.SymbolPath.CIRCLE,
										    fillOpacity: 0.5,
										    fillColor: 'ff0000',
										    strokeOpacity: 1.0,
										    strokeColor: 'fff000',
										    strokeWeight: 3.0, 
										    scale: 10 //pixels
										  }
									});
							$(mapSelc).gmap('option', 'center', new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
					         
						}
						
					}, 
					function(positionErr){ 
						if(positioningIsActive != true){
			        		navigator.geolocation.clearWatch(watchID);
			        		return;
			        	}
			        	 //TODO:
//						alert('ineer:'+positionErr.message);
						locationDetectionFaild();
						//$.mobile.changePage($('#staticmap-page'), {}); 
					},
					{ 
						maximumAge: 3000, 
						timeout: 50000, 
						enableHighAccuracy: true 
					}
					); 
			} else {
				//TODO:
				locationDetectionFaild();
//				alert('outer: Unable to get location.');
			}
	}
	
	function addBranchesMarkers(branches){
		
		$(mapSelc).gmap('clear', 'markers');
		// add branches markers
		console.log("mapFilter>>>> " + mapFilter);
		
		var len = branches.length;
		for (var i=0; i<len ; i++){
			var branch = branches[i];
			var atm = (mapFilter[0]==1 || mapFilter[1] == 1)? 0 : 1;
			if((mapFilter[0]==1 && branch.GentlementsFlag == 0)||(mapFilter[1]==1 && branch.GentlementsFlag == 1)||(mapFilter[2]==1 && branch.depositFlag == 1)||(mapFilter[3]==1 && branch.depositFlag == 0)){
				var pos = new google.maps.LatLng(branch.coordinatesLat, branch.coordinatesLng) ;
				var icon = icons[(branch.branchOrAtm == 1)?((branch.GentlementsFlag == 1)?3:2):((branch.depositFlag == 1)?1:0)];
				addMarker({destination:pos,branchId:i,atm:branch.branchOrAtm,dep:branch.depositFlag,gen:branch.GentlementsFlag});
			}
		}
		
		$(mapSelc).gmap('refresh');	
		
	}
	
	
	function getCityBranchesSuccess(response){
//		alert("su");
		
		//Localize City Name
		$(mapHeaderSelc).text(response.result.city.Desc);
		
		//create map centered to city center
		
		createMap(response.result.city);
		
		if(mapMode == 0){
			//add current position marker
			addCurrentPosMarker();
		}
		
		
		// add branches markers
//		alert(markersArray.length);
		markersArray = markersArray.concat(response.result.ATMLocations) ;
//		alert(markersArray.length);
		addBranchesMarkers(markersArray);
		
	}
	
	function getCityBranchesError(response){
		//TODO:
		if(response.result.ATMLocations && response.result.ATMLocations.length > 0){
			// no matched city, returned default City
			//Center Map at returned City
			$(mapSelc).gmap('option', 'center', new google.maps.LatLng(response.result.city.coordinatesLat, response.result.city.coordinatesLng));
			//Localize City Name
			$(mapHeaderSelc).text(response.result.city.Desc);
			// add branches markers
			markersArray = response.result.ATMLocations;
			addBranchesMarkers(response.result.ATMLocations);
		}else{
			//Network Error 
			App.showErrorDialog(response.msg.msgText);
			//$.mobile.changePage("#homeScreen-page");
			App.changePage("#homeScreen-page");
		}
	}
	
	function getCityDetails(cityNamesList){
//		alert("getCityBranches");
		DataContext.getCityDetails(cityNamesList,getCityBranchesSuccess,getCityBranchesError);
	}
	
	
	function makeMarker(options){
		   var pushPin = new google.maps.Marker({map:map});
		   pushPin.setOptions(options);
		   google.maps.event.addListener(pushPin, 'click', function(){
		     infoWindow.setOptions(options);
		     infoWindow.open(map, pushPin);
		   });
		   markerArray.push(pushPin);
		   return pushPin;
		 }	
		
	function addMarker(options){
		//alert(options.destination+" "+options.icon+" "+options.branchId);
		var marker = $(mapSelc).gmap('addMarker', 
				{ 	'id'		:'m_'+options.branchId,
					'position'	: options.destination, 
//					'animation' : google.maps.Animation.DROP,
					'icon'		: options.icon,
					'atm'		: options.atm,
					'dep'		: options.dep,
					'gen'		: options.gen
				}); 
		marker.click(function() {
			//$(mapSelc).gmap('openInfoWindow', {'content': 'Hello World!'}, this);
			openBrancheDetailsView(options.branchId)
		});
	}
	
	function openBrancheDetailsView(branchId){
		//$.mobile.changePage("#mapLocationDetails-page?id="+branchId);
		App.changePage("#mapLocationDetails-page?id="+branchId);
	}
	
	
	
	function fadingMsg (locMsg) {
		 $("<div class='ui-overlay-shadow ui-body-e ui-corner-all fading-msg'>" + locMsg + "</div>")
		 .css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 100 })
		 .appendTo( $.mobile.pageContainer )
		 .delay( 2200 )
		 .fadeOut( 1000, function(){
		     $(this).remove();
		});
	}
	
	
	function selectionControlClicked(){
		($('#myddOptsDiv').css("display") == 'block') ? $('#myddOptsDiv').css("display", 'none') : $('#myddOptsDiv').css("display", 'block');
		($('#tab1').css("display") == 'block') ? $('#tab1').css("display", 'none') : $('#tab1').css("display", 'block');
	}
	
	function checkBoxClicked(num){
		
		var sel;
		switch (num){
			case 0:
				sel = "#menCheck";
				break;
			case 1:
				sel = "#ladesCheck";
				break;
			case 2:
				sel = "#depositCheck";
				break;
			case 3:
				sel = "#nonDepositCheck";
				break;
		}		
//		($(sel).css("display") == 'block') ? $(sel).css("display", 'none') : $(sel).css("display", 'block');
		console.log(sel);
		if($(sel).css("display") == 'block'){
			$(sel).css("display", 'none');
			mapFilter[num] = 0;
		}else{
			$(sel).css("display", 'block');
			mapFilter[num] = 1;
		}
		
		$(mapSelc).gmap('clear', 'markers');
		
		addBranchesMarkers(markersArray);
		
		$(mapSelc).gmap('refresh');	
		
		
	}
	
	function reloadMarkers(){
		
	}
	
	function drowpDownTabClicked(num){
		if(num==0){
			if($('#branchesTab').attr('class') == "selectedDropdownTab"){
				($('#branchesList').css("display") == 'block') ? $('#branchesList').css("display", 'none') : $('#branchesList').css("display", 'block');
			}else{
				$("#branchesTab").removeClass("nonSelectedDropdownTab").addClass("selectedDropdownTab");
				$("#ATMTab").removeClass("selectedDropdownTab").addClass("nonSelectedDropdownTab");
				$('#ATMList').css("display", 'none') ;
				$('#branchesList').css("display", 'block');
			}
		}else{
			if($('#ATMTab').attr('class') == "selectedDropdownTab"){
				($('#ATMList').css("display") == 'block') ? $('#ATMList').css("display", 'none') : $('#ATMList').css("display", 'block');
			}else{
				$("#ATMTab").removeClass("nonSelectedDropdownTab").addClass("selectedDropdownTab");
				$("#branchesTab").removeClass("selectedDropdownTab").addClass("nonSelectedDropdownTab");
				$('#branchesList').css("display", 'none') ;
				$('#ATMList').css("display", 'block');
			}
		}
	}
	
	function cancelRouteMode(){
		var rout = $(mapSelc).gmap('get', 'services > DirectionsRenderer');
		if(rout){
			rout.setMap(null);
			rout.setPanel(null);
		}
		$(mapSelc).gmap('refresh');	
		addBranchesMarkers(markersArray);
		addCurrentPosMarker();
		mapMode = prevMapMode;
		$("#cancelroute").css("display","none");
		$("#nearsestBtn").css("display","block");
		$("#menuFilterBtn").css("display","block");
		
	}
	
	function homeBtnClicked(){
		
		if(mapMode == 2){
			var rout = $(mapSelc).gmap('get', 'services > DirectionsRenderer');
			if(rout){
				rout.setMap(null);
				rout.setPanel(null);
			}
			$(mapSelc).gmap('refresh');	
			addBranchesMarkers(markersArray);
			addCurrentPosMarker();
			mapMode = prevMapMode;
			$("#mapHomeBtn").changeButtonText("City");
		}else{
			//$.mobile.changePage($("#selectMapCity-page"));
			App.changePage("#selectMapCity-page");
		}
		
	}
	
	function posBtnClicked(){
		
		addCurrentPosMarker();
	}
	
	function openFilterDiv(){
//		findNearestMarker();
		$( "#popupPanel" ).popup( "open", {positionTo:"window"} );
	}
	
	
	function renderFilterCitiesList(){
		
		$("#mapCityList").empty();
		
		var len = mapSelectCitiesList.length;
		console.log("LEN: "+len);
		if (len >0  ) {
			var html = "";

			for ( var i = 0; i < len; i++) {
				var city = mapSelectCitiesList[i];
				html += "<option value=" + city.code + "> "+ city.value + " </option>";
			}

			$("#mapCityList").append(html);
			$("#mapCityList").selectmenu("refresh", true); // true 
		}
	}
	/*
	function refreshFooter(){
		//********
		$("#mapFilterDiv").empty();
		
		var list = ['images/checkmark_unchecked.png' ,'images/checkmark_checked.png'];
		mapSelectCitiesList
		
		var html = 	$('<ul id="mapFilterList" data-role="listview" data-inset="true">'
						+'<li class="costum-input-row">'
							+"<div style='color: #787878;font-size:12px;text-align:left'><table><tbody><tr style='height:33px;'>" 
								+"<td width='20%'  align='left'>"
									+"Branch"
								+"</td>"
								+"<td width='40%' onclick='MapController.filterOptionclicked("+"billCell_1_img"+",0);'>"
									+"<img id='billCell_1_img' src='"+list[mapFilter[0]]+"' class='mapCheckImg'/> "+Loc.mapPage.men
								+"</td>"
								+"<td width='40%' onclick='MapController.filterOptionclicked("+"billCell_2_img"+",1);'>"
									+"<img id='billCell_2_img' src='"+list[mapFilter[1]]+"' class='mapCheckImg' /> "+Loc.mapPage.ladies 
								+"</td>"
							+"</tr></table></tbody></div>"
						+'</li>'
						+"<hr class='splitter mapfilterSplitter'>"
						+'<li class="costum-input-row">'
							+"<div style='color: #787878;font-size:12px;text-align:left'><table><tbody><tr style='height:33px;'>" 
								+"<td width='20%'  align='left'>"
									+Loc.mapPage.atm
								+"</td>"
								+"<td width='40%' onclick='MapController.filterOptionclicked("+"billCell_1_img"+",2);'>"
									+"<img id='billCell_1_img' src='"+list[mapFilter[2]]+"' class='mapCheckImg'/> "+Loc.mapPage.deposit
								+"</td>"
								+"<td width='40%' onclick='MapController.filterOptionclicked("+"billCell_2_img"+",3);'>"
									+"<img id='billCell_2_img' src='"+list[mapFilter[3]]+"' class='mapCheckImg' /> "+Loc.mapPage.nonDeposit 
								+"</td>"
							+"</tr></table></tbody></div>"
						+'</li>'
					+'</ul>');
		
		
//		var html = 	"<div class='white' style='font-size:12px;text-align:left'><table><tbody>" 
//					+"<tr>" 
//						+"<td width='50%'  align='center'>"
//							+Loc.mapPage.branch
//						+"</td>"
//						+"<td width='50%' align='center'>"
//							+Loc.mapPage.atm 
//						+"</td>"
//					+"</tr>"
//					+"<tr>" 
//						+"<td width='50%' onclick='MapController.filterOptionclicked("+"billCell_1_img"+",0);'>"
//							+"<img id='billCell_1_img' src='"+list[mapFilter[0]]+"' class='mapCheckImg'/> "+Loc.mapPage.men
//						+"</td>"
//						+"<td width='50%' onclick='MapController.filterOptionclicked("+"billCell_2_img"+",2);'>"
//							+"<img id='billCell_2_img' src='"+list[mapFilter[2]]+"' class='mapCheckImg' /> "+Loc.mapPage.deposit 
//						+"</td>"
//					+"</tr>"
//					+"<tr>" 
//						+"<td width='50%' onclick='MapController.filterOptionclicked("+"billCell_3_img"+",1);'>"
//							+"<img id='billCell_3_img' src='"+list[mapFilter[1]]+"' class='mapCheckImg'/> "+Loc.mapPage.ladies
//						+"</td>"
//						+"<td width='50%' onclick='MapController.filterOptionclicked("+"billCell_4_img"+",3);'>"
//							+"<img id='billCell_4_img' src='"+list[mapFilter[3]]+"' class='mapCheckImg'/> "+Loc.mapPage.nonDeposit
//						+"</td>"
//					+"</tr>"
//					+"</table></tbody></div>";
		
		
		
		$("#mapFilterDiv").append(html);
		
		html.listview();
		
		//********
		
		
	}
	*/
	function filterOptionclicked(img,num){
		if (mapFilter[num] == 0){
			mapFilter[num] = 1;
//			$(img).attr("src","images/checkmark_checked.png");
		}else{
			mapFilter[num] = 0;
//			$(img).attr("src","images/checkmark_unchecked.png");
		}
		
		
//		refreshFooter();
		
		$(mapSelc).gmap('clear', 'markers');
		
		addBranchesMarkers(markersArray);
		
		$(mapSelc).gmap('refresh');	
	}
	
	
	return{
		init:init,
		loadCity:loadCity,
		selectionControlClicked:selectionControlClicked,
		checkBoxClicked:checkBoxClicked,
		drowpDownTabClicked:drowpDownTabClicked,
		homeBtnClicked:homeBtnClicked,
		posBtnClicked:posBtnClicked,
		filterOptionclicked:filterOptionclicked,
		showDir:showDir,
		cancelRouteMode:cancelRouteMode,
		findNearestMarker:findNearestMarker,
		openFilterDiv:openFilterDiv
		
		//TODO:
		,getCityBranchesSuccess:getCityBranchesSuccess
		,getCityBranchesError:getCityBranchesError,
		getCitiesNamesSuccess:getCitiesNamesSuccess
		//End
	}
	
})();


DataContext.getCityDetails = function(cityNamesList,success,error){
	var city = "'"+cityNamesList[0]+"'";
	for(var i=1 ; i< cityNamesList.length ; i++){
		city = city +",'"+cityNamesList[i]+"'";
	}
	
//	alert(city);
	
	var reqBody = {"cityId":city};
	
	//var request = new Req.RequestModel("Locations", "ATMLocationServices",reqBody,"fetchFirst");
	
//	result= Req.sendRequest(request,success,error);
	
	//TODO:
	var Riyadh={"status":"1","msg":{"msgCode":"I000000","msgType":"I","msgText":""}
		,"result":{
			"ATMLocations":[
			                {"branchOrAtm":"1","coordinatesLat":"24.706767","coordinatesLng":"46.675417","depositFlag":"-1","GentlementsFlag":"0","phoneNum":"4634910","bank":"Head office","area":"Al olaya","street":"King Fahad Road","type":"-","deposit":"-"}
			                ,{"branchOrAtm":"1","coordinatesLat":"24.598767","coordinatesLng":"46.641400","depositFlag":"-1","GentlementsFlag":"1","phoneNum":"4491177","bank":"Dahrath Al Badeeah Branch (Gentlemen and Ladies)","area":"Dahrath Al Badeeah","street":"Al Madenah Almunawara Road","type":"-","deposit":"-"}
			                ,{"branchOrAtm":"1","coordinatesLat":"24.693067","coordinatesLng":"46.671700","depositFlag":"-1","GentlementsFlag":"1","phoneNum":"4649220","bank":"Takassusi branch (Gentlemen and Ladies)","area":"Alolaya","street":"Takassusi","type":"-","deposit":"-"}
			                ,{"branchOrAtm":"1","coordinatesLat":"24.605508","coordinatesLng":"46.704941","depositFlag":"-1","GentlementsFlag":"1","phoneNum":"4572761","bank":"Al-Swaide Branch (Gentlemen and Ladies)","area":"Al-Swaide Dist","street":"Al-Swaide Street","type":"-","deposit":"-"}
			                ,{"branchOrAtm":"1","coordinatesLat":"24.692400","coordinatesLng":"46.724017","depositFlag":"-1","GentlementsFlag":"0","phoneNum":"4757590","bank":"Al Malaz Branch","area":"Al Zahra","street":"Salah Al Deen Al-Ayoubi Road","type":"-","deposit":"-"}
			                ,{"branchOrAtm":"1","coordinatesLat":"24.693333","coordinatesLng":"46.767650","depositFlag":"-1","GentlementsFlag":"1","phoneNum":"4916530","bank":"Al Rbowh Branch (Gentlemen and Ladies)","area":"Al Rabowh Dist","street":"Omar Bin Abdulaziz Street","type":"-","deposit":"-"}
			                ,{"branchOrAtm":"1","coordinatesLat":"24.779483","coordinatesLng":"46.663200","depositFlag":"-1","GentlementsFlag":"1","phoneNum":"2691717","bank":"Al Ghadeer Branch (Gentlemen and Ladies)","area":"Al Ghadeer Dist","street":"King Abdulaziz Road","type":"-","deposit":"-"}
			                ,{"branchOrAtm":"1","coordinatesLat":"24.715250","coordinatesLng":"46.792317","depositFlag":"-1","GentlementsFlag":"1","phoneNum":"4916206","bank":"Rayaan Branch (Gentlemen and Ladies)","area":"Rayaan Dist","street":"Imam Shafeay street","type":"-","deposit":"-"}
			                ,{"branchOrAtm":"1","coordinatesLat":"24.766750","coordinatesLng":"46.807367","depositFlag":"-1","GentlementsFlag":"1","phoneNum":"2263777","bank":"Nahdah Branch (Gentlemen and Ladies)","area":"Al Nahdah Dist","street":"Salman Al Farsi street","type":"-","deposit":"-"}
			                ,{"branchOrAtm":"1","coordinatesLat":"24.587717","coordinatesLng":"46.761067","depositFlag":"-1","GentlementsFlag":"1","phoneNum":"4380624","bank":"Al-Aziziyah Branch (Gentlemen and Ladies)","area":"Azizia Dist","street":"Al-Nasr Street","type":"-","deposit":"-"}
			                ,{"branchOrAtm":"1","coordinatesLat":"24.642544","coordinatesLng":"46.721036","depositFlag":"-1","GentlementsFlag":"0","phoneNum":"4092424","bank":"AlAmal district (Albatha)","area":"AlAmal District","street":"Asad bin Alforat","type":"-","deposit":"-"}
			                ,{"branchOrAtm":"1","coordinatesLat":"24.691658","coordinatesLng":"46.806055","depositFlag":"-1","GentlementsFlag":"1","phoneNum":"4459923","bank":"AlRawabi","area":"AlRawabi","street":"Prince Saad bin Abdulrahman Road","type":"-","deposit":"-"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.573967","coordinatesLng":"46.605900","depositFlag":"0","GentlementsFlag":"-1","phoneNum":"4459923","bank":"West Ring Sinaaia","area":"Dahrat namar","street":"Med. Of Sinaaiah","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.546517","coordinatesLng":"46.665650","depositFlag":"0","GentlementsFlag":"-1","phoneNum":"4459923","bank":"Roais Station","area":"Alhazm","street":"Dirab Way","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.694717","coordinatesLng":"46.813117","depositFlag":"0","GentlementsFlag":"-1","phoneNum":"4459923","bank":"Al Matrodi","area":"Alsalam","street":"Saad Bin AbdullRahman","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.591950","coordinatesLng":"46.776117","depositFlag":"0","GentlementsFlag":"-1","phoneNum":"4459923","bank":"Qurtoba Market","area":"Azizia","street":"Azizia Main","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.729717","coordinatesLng":"46.784950","depositFlag":"0","GentlementsFlag":"-1","phoneNum":"4459923","bank":"Kodo ( Khorais )","area":"Al Rawda","street":"Khorais Street","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.712283","coordinatesLng":"46.847450","depositFlag":"0","GentlementsFlag":"-1","bank":"Saudi Power Station","area":"Al Saadah","street":"Saad Bin AbdullRahman","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.536150","coordinatesLng":"46.711000","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Furaian Station","area":"Bader","street":"Fateh Makkah","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.723683","coordinatesLng":"46.797167","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Zuhairy Station (Liter)","area":"Al Manar","street":"Ibn Nafis with Atahia Cross","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.834733","coordinatesLng":"46.610550","depositFlag":"0","GentlementsFlag":"-1","bank":"Aba Nummay Station","area":"-","street":"Riyadh - Qassim Street","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.747300","coordinatesLng":"46.585567","depositFlag":"0","GentlementsFlag":"-1","bank":"Anqa Station","area":"-","street":"King Khaled - Salbukh Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.716800","coordinatesLng":"46.827950","depositFlag":"0","GentlementsFlag":"-1","bank":"Alsalam Stars saad bin abi waqas st","area":"West Al Naseem","street":"Saad bin abi waqas st","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.735883","coordinatesLng":"46.681100","depositFlag":"0","GentlementsFlag":"-1","bank":"AlRaja Furniture","area":"King Fahad","street":"King Abdullah Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.583983","coordinatesLng":"46.627333","depositFlag":"0","GentlementsFlag":"-1","bank":"Riman Market","area":"-","street":"Hamza Bin AbdullMutalib Street","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.578883","coordinatesLng":"46.558867","depositFlag":"0","GentlementsFlag":"-1","bank":"Nasser Club Land","area":"Twaiq","street":"Bilal Bin Rabah Street","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.802200","coordinatesLng":"46.860267","depositFlag":"0","GentlementsFlag":"-1","bank":"Jinadrya Land","area":"Jinadrya","street":"30th Street","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.693850","coordinatesLng":"46.784217","depositFlag":"0","GentlementsFlag":"-1","bank":"Alsalam Stars Rawabi","area":"Al Rawabi","street":"Onaiza Street","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.691350","coordinatesLng":"46.851533","depositFlag":"0","GentlementsFlag":"-1","bank":"Sulai Land","area":"Al Sulai","street":"Exit 16","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.808933","coordinatesLng":"46.887000","depositFlag":"0","GentlementsFlag":"-1","bank":"Nadeem Land","area":"Nadeem","street":"Wassat Al Hay","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.569867","coordinatesLng":"46.834417","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Yasameen Center- 1","area":"Iskan Alkharj","street":"Kharj Road","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.706767","coordinatesLng":"46.675417","depositFlag":"1","GentlementsFlag":"-1","bank":"Head office","area":"Al olaya","street":"King Fahad Road","type":"Lobby","deposit":"Yes"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.692400","coordinatesLng":"46.724017","depositFlag":"1","GentlementsFlag":"-1","bank":"Al Malaz Branch","area":"Al Zahra","street":"Salah Al Deen Al-Ayoubi Road","type":"Lobby","deposit":"Yes"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.598767","coordinatesLng":"46.641400","depositFlag":"1","GentlementsFlag":"-1","bank":"Dahrath Al Badeeah Branch","area":"Dahrath Al Badeeah","street":"Al Madenah Almunawara Road","type":"Lobby","deposit":"Yes"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.755800","coordinatesLng":"46.684067","depositFlag":"0","GentlementsFlag":"-1","bank":"Training Center","area":"King Fahad","street":"Imamm Mohammed Bin Saud Way","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.693067","coordinatesLng":"46.671700","depositFlag":"1","GentlementsFlag":"-1","bank":"Takassusi branch","area":"Alolaya","street":"Takassusi","type":"Lobby","deposit":"Yes"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.600917","coordinatesLng":"46.714350","depositFlag":"0","GentlementsFlag":"-1","bank":"Manfoha Room","area":"Manfoha","street":"20th Street","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.583300","coordinatesLng":"46.615200","depositFlag":"0","GentlementsFlag":"-1","bank":"Madina Road Show Room","area":"-","street":"Madina Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.495750","coordinatesLng":"46.628100","depositFlag":"0","GentlementsFlag":"-1","bank":"Derab","area":"Alfawaz","street":"alhijaz road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.591200","coordinatesLng":"46.576400","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Saeed Station","area":"Twaiq","street":"Al Waleed Bin AbdulMalik Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.763200","coordinatesLng":"46.746300","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Hamra Computer Market","area":"Al Hamra","street":"King Abdullah Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.693733","coordinatesLng":"46.772883","depositFlag":"0","GentlementsFlag":"-1","bank":"Moasat  Hospital","area":"AlRabwah","street":"Exit 14","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.766983","coordinatesLng":"46.663850","depositFlag":"0","GentlementsFlag":"-1","bank":"Honda \u0026 Toyota Show Room","area":"Almaroj","street":"North Ring Way","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.847533","coordinatesLng":"46.859083","depositFlag":"0","GentlementsFlag":"-1","bank":"Abo Haithem Station","area":"Jinadrya","street":"Dammam Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.716783","coordinatesLng":"46.681567","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Sanad Room","area":"Worood","street":"Musaad Al Anqari","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.692150","coordinatesLng":"46.710833","depositFlag":"0","GentlementsFlag":"-1","bank":"Mazen Hotels Group","area":"Sulaymaniyah","street":"Prince Musaad","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.619833","coordinatesLng":"46.745117","depositFlag":"0","GentlementsFlag":"-1","bank":"Othaim Market Mansora","area":"Mansora","street":"Prince Mohammad Street","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.792683","coordinatesLng":"46.851667","depositFlag":"0","GentlementsFlag":"-1","bank":"Nasser Building","area":"Jinadrya","street":"Sultan Qabus Street\u0027","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.593451","coordinatesLng":"46.738329","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Ekrish Room","area":"Al Massana Dist","street":"Al Batha Room","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.579832","coordinatesLng":"46.609282","depositFlag":"0","GentlementsFlag":"-1","phoneNum":"-","bank":"Al Obaikan Badia 2","area":"Al Eskan District","street":"Kharj Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.494569","coordinatesLng":"39.592752","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Yasameen Center-L 2","area":"Al Eskan District","street":"Kharj Road","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.557428","coordinatesLng":"46.484871","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Hejaz Station","area":"-","street":"ejaz Road\u0027","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.609332","coordinatesLng":"46.656017","depositFlag":"0","GentlementsFlag":"-1","bank":"Badia Plaza","area":"BadiaDistrict","street":"Madina Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.704771","coordinatesLng":"46.824589","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Salam Land","area":"Al Salam Dist","street":"Abdulrahman Bin Auf Street","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.594036","coordinatesLng":"46.738586","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Ekrish Room","area":"Al Massana Dist","street":"Al Batha Room","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.579597","coordinatesLng":"46.609411","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Obaikan Badia 2","area":"Badia District","street":"Madina Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.74157","coordinatesLng":"46.673312","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Mulaihi Room","area":"King Fahad Dist","street":"Prince Naif Street","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.494413","coordinatesLng":"39.592752","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Yasameen Center-L 2","area":"Al Eskan District","street":"Kharj Road","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.798968","coordinatesLng":"46.875014","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Babtain Station","area":"Al Nadwa Dist","street":"30th Street","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.605118","coordinatesLng":"46.704683","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Sweedy - DU","area":"Al Sweedy Dist","street":"Al Sweedy Street","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.60513","coordinatesLng":"46.705019","depositFlag":"1","GentlementsFlag":"-1","bank":"Al Sweedy Branch","area":"Al Sweedy Dist","street":"Al Sweedy Street","type":"Lobby","deposit":"Yes"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.811629","coordinatesLng":"46.868792","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Ahlia Station","area":"Jinadrya Dist","street":"Hamad Al Thani","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.545171","coordinatesLng":"46.647134","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Rashed Station","area":"Al Hazm dist","street":"Hamza Bin AbdullMutalib Street","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.813667","coordinatesLng":"46.774117","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Abadi Station","area":"Yarmuk Dist","street":"Dammam Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.693333","coordinatesLng":"46.767650","depositFlag":"1","GentlementsFlag":"-1","bank":"Al Rbowh Branch","area":"Al Rabowh Dist","street":"Omar Bin Abdulaziz Street Exit14","type":"Lobby","deposit":"Yes"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.693100","coordinatesLng":"46.767517","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Rbowh Branch - DU","area":"Al Rabowh Dist","street":"Omar Bin Abdulaziz Street Exit14","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.768133","coordinatesLng":"46.806100","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Khaleej Station","area":"Al Khaleej Dist","street":"Salman Al Farsi","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.779483","coordinatesLng":"46.663200","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Ghadeer Branch - DU","area":"Al Ghadeer Dist","street":"King Abdulaziz Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.570767","coordinatesLng":"46.637683","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Amjad Pharmacy","area":"Al Badia Dist","street":"Hamza Bin AbdullMutalib Street","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.740067","coordinatesLng":"46.850300","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Babtain Station - Nassim","area":"Nassim Dist","street":"Saba\u0027a street","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.586933","coordinatesLng":"46.665883","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Rajhi Market","area":"Swaidi Dist","street":"Swaidi Main Street","type":"Lobby","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.691483","coordinatesLng":"46.718400","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Daleel Station","area":"Dhobat Dist","street":"King Abdulaziz Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.714817","coordinatesLng":"46.634883","depositFlag":"0","GentlementsFlag":"-1","bank":"King Saud Univ. Station","area":"Alraid Dist","street":"King Abdullah Road","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.708233","coordinatesLng":"46.841233","depositFlag":"0","GentlementsFlag":"-1","bank":"Sharq Communication Market","area":"Nassim Dist","street":"Saad Bin AbdullRahman","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.599083","coordinatesLng":"46.644417","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Yamama Market","area":"Badia Dist","street":"Aisha Bint Abo Baker","type":"Drive - Up","deposit":"No"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.732900","coordinatesLng":"46.834317","depositFlag":"1","GentlementsFlag":"-1","bank":"Nassem  Branch","area":"Nassim Dist","street":"Hassan Bin Thabit Street","type":"Lobby","deposit":"Yes"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.779500","coordinatesLng":"46.663000","depositFlag":"1","GentlementsFlag":"-1","bank":"Al Ghadeer Branch","area":"Al Ghadeer Dist","street":"King Abdulaziz Road","type":"Lobby","deposit":"Yes"}
			                ,{"branchOrAtm":"0","coordinatesLat":"24.761250","coordinatesLng":"46.812083","depositFlag":"0","GentlementsFlag":"-1","bank":"Al Raya Center","area":"Al Nahdah Dist","street":"Salman Al Farsi  Street","type":"Lobby","deposit":"No"}]
			,"city":{"cityId":1,"Desc":"Riyadh","coordinatesLat":"24.657955","coordinatesLng":"46.720000","zoom":11}}};
	
	var Jeddah = {"status":"1","msg":{"msgCode":"I000000","msgType":"I","msgText":""}
					,"result":{"ATMLocations":[{"branchOrAtm":"0","coordinatesLat":"21.576433","coordinatesLng":"39.150517","depositFlag":"1","GentlementsFlag":"-1","phoneNum":"","bank":"Al Rawdah Branch","area":"Al Rawdah","street":"Sari Road","type":"Lobby","deposit":"Yes"}
												,{"branchOrAtm":"0","coordinatesLat":"21.593467","coordinatesLng":"39.174700","depositFlag":"1","GentlementsFlag":"-1","phoneNum":"","bank":"Al Rabwah Branch","area":"Al Rabwah","street":"King Fahad Road","type":"Lobby","deposit":"Yes"}]
								,"city":{"cityId":21,"Desc":"Jeddah","coordinatesLat":"21.576433","coordinatesLng":"39.150517","zoom":11}}};
	
	var Taif 	={"status":"1","msg":{"msgCode":"I000000","msgType":"I","msgText":""}
					,"result":{"ATMLocations":[{"branchOrAtm":"0","coordinatesLat":"21.291567","coordinatesLng":"40.403700","depositFlag":"1","GentlementsFlag":"-1","phoneNum":"","bank":"Moeashi Branch","area":"Moeashi","street":"Al Jaish Road","type":"Lobby","deposit":"Yes"}
												,{"branchOrAtm":"0","coordinatesLat":"21.471883","coordinatesLng":"40.476800","depositFlag":"0","GentlementsFlag":"-1","phoneNum":"","bank":"Marhaba Station","area":"Halaqa","street":"Al Sail Way","type":"Drive - Up","deposit":"No"}]
								,"city":{"cityId":22,"Desc":"Taif","coordinatesLat":"21.320000","coordinatesLng":"40.403700","zoom":11}}}
	
	var response = {};
	if(cityNamesList[0] == "Riyadh" || cityNamesList[0] == "الرياض"){
		response = Riyadh;
	}else if(cityNamesList[0] == "Jeddah"){
		response	= Jeddah;
	}else if(cityNamesList[0] == "Taif"){
		response = Taif
	}
	
	MapController.getCityBranchesSuccess(response);
//	MapController.getCityBranchesError(response);
	
	//End
}


DataContext.getMapCitiesNames = function(success,error){

	var reqBody = {};
	
	//var request = new Req.RequestModel("Locations", "ATMLocationServices",reqBody,"getCities");
	
//	result= Req.sendRequest(request,success,error);
	
	//TODO:
	var response={"status":"1","msg":{"msgCode":"I000000","msgType":"I","msgText":"sucess"}
					,"result":[{"code":"Riyadh","value":"Riyadh"}
							,{"code":"Jeddah","value":"Jeddah"}
							,{"code":"Taif","value":"Taif"}]};
	
	MapController.getCitiesNamesSuccess(response);
	//End
}






//alert("map");
//var namesList = ['Olaya','Riyadh','Riyadh Province'];
// getCityDetails(namesList);
//return ;


//result = DataContext.getCityBranches(1,1,1);
//
//if(result && result.branches && result.branches.length > 0){
//	cityBranches = result;
//	//$.mobile.changePage("#page-map");
//}
//else{
//	fadingMsg("Couldn't get current position.");
//	$.mobile.changePage($('#homeScreen-page'), {});
//}



/*
var map = new google.maps.Map($('#map_canvas'), {'center' : mapdata.destination, 
	 'zoom' : 12,
		'mapTypeControl' : true, 
		'navigationControl' : true,
		'navigationControlOptions' : {'position':google.maps.ControlPosition.LEFT_TOP}
		});
		
		.bind('init', function(evt, map) { 
		marker = $('#map_canvas').gmap('addMarker', 
			{ 'position':  mapdata.destination, 
			  'animation' : google.maps.Animation.DROP,
			  'title': "Check this cool location",
			  'icon': "images/ATM3D.png",
			});    
		//$('.refresh').trigger('tap');				
	})
*/
/*
var cityPos = cityBranches.city.lat+','+cityBranches.city.lng;
//alert(cityPos);
$(mapSelc).gmap({'center' :cityPos, 
	'zoom' : cityBranches.city.zoom,
	'mapTypeControl' : true, 
	'navigationControl' : false,
	'streetViewControl': false,
	});
for (var i=0; i<cityBranches.branches.length ; i++){
	var branch = cityBranches.branches[i];
	var pos = new google.maps.LatLng(branch.lat, branch.lng) ;
	var icon = icons[(branch.branchATM)?((branch.ladies)?0:1):((branch.deposit)?2:3)];
	addMarker({destination:pos,icon:icon,branchId:branch.branchId});
	//break;
}

//var dropdown = document.getElementById('dropdown-holder');
// map.controls[google.maps.ControlPosition.TOP_RIGHT].push(dropdown);

$(mapSelc).gmap('addControl', $("#dropdownFilter"), google.maps.ControlPosition.LEFT_TOP);
$(mapSelc).gmap('addControl', $("#mapBottomControl"), google.maps.ControlPosition.BOTTOM_CENTER);
*/

//lat:24.34438,lng:46.36354},
//lat:24.32791,lng:46.39939},
//{branchId:3,branchATM:1,deposit:1,ladies:0,lat:24.41683,lng:46.48787}]
//var mapdata = { destination: new google.maps.LatLng(24.32791, 46.39939) };
//var mapdata = { destination: new google.maps.LatLng(24.706881, 46.675699) };
//var infoWindow = new google.maps.InfoWindow();



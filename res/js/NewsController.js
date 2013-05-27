var NewsController =  NewsController || {};

NewsController = (function(){
	
	var newsPageSel	= "#news-page";
	var $newsList	= $("#newsList");
	var newsList 	=[];
	
	
	var newsDetailsPageSel = "#newsDetails-page";
	var tempNewsItem ={};
	
	function init(){
		
		
		
		$(newsPageSel).on("pagebeforeshow", function() {
		
			retrieveNews();
		});	

		$(newsDetailsPageSel).on("pagebeforeshow", function() {
			$("#newsDetailsTitle").text(tempNewsItem.title);
			$("#newsDetailsDate").text(tempNewsItem.date);
			$("#newsDetailsDisc").text(tempNewsItem.desc);
			$("#newsDetailsHeaderDiv").css("background-image",'url('+tempNewsItem.img+')');
		});			
		
		
	} // init()
	

	function retrieveNews(){
		var list = [{title:"News Title news title news title",img:"http://www.drsulaimanalhabib.com/images/stories/ISO_event/11.png",desc:"News news details news details news details news details news details news details news details 	news details news details news details",date:"15/5/2013"},
					{title:"News Title news title news title",img:"http://www.drsulaimanalhabib.com/images/stories/ISO_event/11.png",desc:"News news details news details news details news details news details news details news details news details news details news details",date:"15/5/2013"},
					{title:"News Title news title news title",img:"http://www.drsulaimanalhabib.com/images/stories/ISO_event/11.png",desc:"News news details news details news details news details news details news details news details news details news details news details",date:"15/5/2013"}];
		newsList = list;
		displayNews(list);
	}
	
	function displayNews(news){
		$newsList.empty();
		var html = "";
		var len = news.length;
		if (len == 0) {
			
		}else{
			for(var i =0 ; i < len; i++){
				var item = news[i];
				var li = 	'<li style="" data-icon="news-disclosure-icon" >'
								+'<a href="#" onclick="NewsController.openNewsDetails('+i+');" class="news-cell"><div ><table><tbody><tr>'
									+'<td width="30%"><div class="news-img" style="background-image:url('+item.img+')"></div></td>'
									+'<td width="70%">'
										+'<div class="ui-li-heading news-title">'+item.title+'</div>'
										+'<hr class="splitter loginFormSplitter">'
										+'<div class="news-date">'+item.date+'</div>'
									+'</td>'
									+'</tr></tbody></table></div></a>	'
							+'</li>';
				html += li;
			}
		}
		
		$newsList.append(html).listview('refresh');
	}
	
	function openNewsDetails(index){
		tempNewsItem = newsList[index];
		$.mobile.changePage(newsDetailsPageSel);
	}
	
	return {
		init:init
		,openNewsDetails:openNewsDetails
		
	}
})();

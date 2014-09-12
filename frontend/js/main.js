$(window).load(function(){
	var pageName = window.location.pathname.split("/")[1];
	$(".nav-col ul > li > a").each(function(){
		if($(this).text() === pageName){
			$(this).css('border-bottom', '3px solid #6CD1D4');
		}
	});
});
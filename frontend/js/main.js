$(window).load(function(){
	var pageName = window.location.pathname.split("/")[1];
	$(".nav-row ul > li > a").each(function(){
		if($(this).text() === pageName){
			$(this).css('background-color', '#6CD1D4');
		}
	});
});
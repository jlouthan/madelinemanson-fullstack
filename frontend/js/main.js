$(window).load(function(){
	var pageName = window.location.pathname.split("/")[1];
	$(".nav-row ul > li > a").each(function(){
		if($(this).text() === pageName){
			$(this).css('background-color', '#6CD1D4');
		}
	});

	$("#right-arrow").click(function(){
		var i = $('#carousel').data('visible-index');
		var total = $('#carousel').data('total-pics');
		console.log(total);
		if(i == total){
			var nextI = 1;
			console.log('in this loop!');
		}
		else{
			var nextI = i+1;
		}
		console.log('nexti is ' + nextI);
		var showing = $( "#carousel li:nth-child(" + i + ")" );
		var next = $( "#carousel li:nth-child(" + nextI + ")" )
		showing.fadeOut("fast", function(){
			$('#carousel').attr('data-visible-index', nextI);
			next.fadeIn('fast', function(){

			});
		});
	});
});
$(window).load(function(){
	var pageName = window.location.pathname.split("/")[1];
	$(".nav-row ul > li > a").each(function(){
		if($(this).text() === pageName){
			$(this).css('background-color', '#6CD1D4');
		}
	});

	if($('#carousel').data('total-pics') == 1){
		$("#right-arrow").css('visibility', 'hidden');
	}

	$("#right-arrow").click(function(){
		var arrow = $(this);
		var i = $('#carousel').data('visible-index');
		var total = $('#carousel').data('total-pics');
		var nextI = i + 1;
		var showing = $( "#carousel li:nth-child(" + i + ")" );
		var next = $( "#carousel li:nth-child(" + nextI + ")" )
		showing.fadeOut("fast", function(){
			if(nextI == total){
				arrow.css('visibility', 'hidden');
			}
			if(nextI == 2){
				$('#left-arrow').css('visibility', 'visible');
			}
			$('#carousel').data('visible-index', nextI);
			next.fadeIn('fast', function(){

			});
		});
	});

	$("#left-arrow").click(function(){
		var arrow = $(this);
		var i = $('#carousel').data('visible-index');
		var total = $('#carousel').data('total-pics');
		var prevI = i - 1;
		var showing = $("#carousel li:nth-child(" + i + ")");
		var prev = $("#carousel li:nth-child(" + prevI + ")");
		showing.fadeOut("fast", function(){
			if(prevI == total-1){
				$('#right-arrow').css('visibility', 'visible');
			}
			if(prevI == 1){
				arrow.css('visibility', 'hidden');
			}
			$("#carousel").data('visible-index', prevI);
			prev.fadeIn("fast", function(){

			});
		});
	});

});
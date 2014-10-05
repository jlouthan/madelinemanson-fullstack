$(window).load(function(){
	var pageName = window.location.pathname.split("/")[1];
	$(".nav-row ul > li").each(function(){
		if($(this).find("a").text() === pageName){
			$(this).css('background-color', '#e3f7f7');
		}
	});

	alignTitle();
	window.addEventListener('resize', alignTitle);

	function alignTitle(){
		var width = document.documentElement.clientWidth;
		if(width > 1280){
			var leftPadding = 134;
		}
		else{
			var extraSpace = (width * 0.48) - (75 + 61 + 74 + 59 + 72);
			var leftPadding = extraSpace / 2;
		}
		$('.title-strip').css('padding-left', leftPadding + 'px');
	}

// !~!~!~!~!!CAROUSEL!~!~!~!~!~!!

	if($('#carousel').data('total-pics') == 1){
		$("#right-arrow").css('visibility', 'hidden');
	}

	if($('#carousel').data('total-pics') == $('#carousel').data('visible-index')){
		$("#right-arrow").css('visibility', 'hidden');
	}

	if($('#carousel').data('visible-index') != 1){
		$('#left-arrow').css('visibility', 'visible');
	}

	$('.title-strip').text($('#carousel li:first-child').data('proj-title'));
	$('.title-strip').css('visibility', 'visible');

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
			$('#carousel').data('visible-index', nextI)
			$('.title-strip').text(next.data('proj-title'));
			window.history.pushState({}, "", "/" + window.location.pathname.split('/')[1] + "/" + window.location.pathname.split('/')[2] + "/" + nextI);
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
			$('.title-strip').text(prev.data('proj-title'));
			window.history.pushState({}, "", "/textile/" + prevI);
			prev.fadeIn("fast", function(){

			});
		});
	});

});
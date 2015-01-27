$(window).load(function(){
	var pageName = window.location.pathname.split("/")[1];
	$(".nav-row ul > li").each(function(){
		if($(this).find("a").text() === pageName){
			$(this).css('background-color', '#e3f7f7');
		}
	});

	alignTitle();
	// resetThreshold();
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
		$('.title-strip-prints').css('padding-left', leftPadding + 'px');
	}

	var currentScrollPx = $(document).scrollTop();
	var headerCollapsed = false;
	var threshold = $(document).height() - $(window).height();

	function resetThreshold(){
		console.log('resetting threshold');
		headerCollapsed = false;
		threshold = $(document).height() - $(window).height();
		console.log('threshold is' + threshold);
	}

	$(window).on('scroll', function(e){
		var scrollTop = $(document).scrollTop();
		if(scrollTop > currentScrollPx){
			if(scrollTop > 45 && scrollTop < threshold){
				if(!headerCollapsed){
					headerCollapsed = true;
					collapseHeader();
					// console.log('more than 45' + headerCollapsed);
				}
			}
		}
		else if($(document).scrollTop() < 55){
			if(headerCollapsed){
				headerCollapsed = false;
				expandHeader();
				// console.log('less than 45' + headerCollapsed);
			}
		}
		currentScrollPx = scrollTop;
	});

	function collapseHeader(){
		var width = document.documentElement.clientWidth;
		if(width < 480){
			$('.nav-row').animate({top: "2em"}, 500);
		}
		else{
		// nav and small icon:
		// $('.nav-row').animate({top: "3em"}, 500);
		// $('.logo').animate({backgroundSize: '70', height: '5em'}, 500);

		// just small icon:
		$('.nav-row').animate({top: ".25em"}, 500);
		$('.logo').animate({backgroundSize: '70', height: '5em'}, 500);

		// just large icon:
		// $('.nav-row').animate({top: "4em"}, 500);
		}
	}

	function expandHeader(){
		var width = document.documentElement.clientWidth;
		if(width < 480){
			$('.nav-row').animate({top: "4.5em"}, 500);
		}
		else{
			$('.nav-row').animate({top: "8.375em"}, 500);
			$('.logo').animate({backgroundSize: '110', height: '8.75em'}, 500);
		}
	}

// !~!~!~!~!!CAROUSEL!~!~!~!~!~!!

	if($('#carousel').data('total-pics') == 1){
		$("#right-arrow").css('visibility', 'hidden');
		$("#right-arrow-prints").css('visibility', 'hidden');
	}

	if($('#carousel').data('total-pics') == $('#carousel').data('visible-index')){
		$("#right-arrow").css('visibility', 'hidden');
		$("#right-arrow-prints").css('visibility', 'hidden');
	}

	if($('#carousel').data('visible-index') != 1){
		$('#left-arrow').css('visibility', 'visible');
		$('#left-arrow-prints').css('visibility', 'visible');
	}

	$('.title-strip').text($('#carousel li:first-child').data('proj-title'));
	var n = $('#carousel').data('visible-index') || 1;
	$('.title-strip-prints').text($('#carousel li:nth-child(' + n + ')').data('proj-title'));
	$('.title-strip').css('visibility', 'visible');

	function convertToSlug(Text)
	{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
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
			$('#carousel').data('visible-index', nextI)
			$('.title-strip').text(next.data('proj-title'));
			window.history.pushState({}, "", "/" + window.location.pathname.split('/')[1] + "/" + window.location.pathname.split('/')[2] + "/" + nextI);
			next.fadeIn('fast', function(){
				resetThreshold();
			});
		});
	});

	$("#right-arrow-prints").click(function(){
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
				$('#left-arrow-prints').css('visibility', 'visible');
			}
			$('#carousel').data('visible-index', nextI)
			$('.title-strip-prints').text(next.data('proj-title'));
			window.history.pushState({}, "", "/" + window.location.pathname.split('/')[1] + "/" + convertToSlug(next.data('proj-title')));
			next.fadeIn('fast', function(){
				resetThreshold();
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
			window.history.pushState({}, "", "/" + window.location.pathname.split('/')[1] + "/" + window.location.pathname.split('/')[2] + "/" + prevI);
			prev.fadeIn("fast", function(){
				resetThreshold();
			});
		});
	});

	$("#left-arrow-prints").click(function(){
		var arrow = $(this);
		var i = $('#carousel').data('visible-index');
		var total = $('#carousel').data('total-pics');
		var prevI = i - 1;
		var showing = $("#carousel li:nth-child(" + i + ")");
		var prev = $("#carousel li:nth-child(" + prevI + ")");
		showing.fadeOut("fast", function(){
			if(prevI == total-1){
				$('#right-arrow-prints').css('visibility', 'visible');
			}
			if(prevI == 1){
				arrow.css('visibility', 'hidden');
			}
			$("#carousel").data('visible-index', prevI);
			$('.title-strip-prints').text(prev.data('proj-title'));
			window.history.pushState({}, "", "/" + window.location.pathname.split('/')[1] + "/" + convertToSlug(prev.data('proj-title')));
			prev.fadeIn("fast", function(){
				resetThreshold();
			});
		});
	});

});
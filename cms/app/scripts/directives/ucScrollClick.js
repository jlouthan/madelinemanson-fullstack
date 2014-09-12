'use strict';

angular.module('cmsFrontendApp')
.directive('ucScrollClick', function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.preventDefault();
            var scrollPos = $($(element).attr('href')).offset().top;
            if(scrollPos<1)scrollPos = 1;
            //$.scrollTo(scrollPos);
            $.scrollTo(scrollPos, 500, {
					axis: 'y',
					easing: 'swing',
					offset: {
						top: -50
					}
				});
        });
    };
});
'use strict';

/**
 * Adds a 'ui-scrollfix' class to the element when the page scrolls past it's position.
 * @param [offset] {int} optional Y-offset to override the detected offset.
 *   Takes 300 (absolute) or -300 or +300 (relative to detected)
 */
angular.module('ui.scrollfix',[]).directive('uiScrollfix', ['$window', '$timeout', function ($window, $timeout) {
  return {
    require: '^?uiScrollfixTarget',
    link: function (scope, elm, attrs, uiScrollfixTarget) {
      // angular.element(document).ready(function () {
        var top = elm[0].offsetTop,
      // var top = elm[0].getBoundingClientRect().top,
          curr = elm[0],
          $target = uiScrollfixTarget && uiScrollfixTarget.$element || angular.element($window);

      while (curr = curr.offsetParent) {
        top += curr.offsetTop;
      }

      var timer = $timeout(function(){
        top = elm[0].offsetTop;
        attrs.uiScrollfix = top;
      });

      // if (!attrs.uiScrollfix) {
      //   attrs.uiScrollfix = top;
      // } else if (typeof(attrs.uiScrollfix) === 'string') {
      //   // charAt is generally faster than indexOf: http://jsperf.com/indexof-vs-charat
      //   if (attrs.uiScrollfix.charAt(0) === '-') {
      //     attrs.uiScrollfix = top - parseFloat(attrs.uiScrollfix.substr(1));
      //   } else if (attrs.uiScrollfix.charAt(0) === '+') {
      //     attrs.uiScrollfix = top + parseFloat(attrs.uiScrollfix.substr(1));
      //   }
      // }
      // });

      function onScroll() {
        // if pageYOffset is defined use it, otherwise use other crap for IE
        var offset;
        if (angular.isDefined($window.pageYOffset)) {
          offset = $window.pageYOffset;
          // console.log("the offset is: " + offset);
        } else {
          var iebody = (document.compatMode && document.compatMode !== 'BackCompat') ? document.documentElement : document.body;
          offset = iebody.scrollTop;
        }
        if (!elm.hasClass('ui-scrollfix') && offset > attrs.uiScrollfix) {
          elm.addClass('ui-scrollfix');
        } else if (elm.hasClass('ui-scrollfix') && offset < attrs.uiScrollfix) {
          elm.removeClass('ui-scrollfix');
        }
        scope.$apply();
      }

      $target.on('scroll', onScroll);

      // Unbind scroll event handler when directive is removed
      scope.$on('$destroy', function() {
        $target.off('scroll', onScroll);
        $timeout.cancel(timer);
      });
    }
  };
}]).directive('uiScrollfixTarget', [function () {
  return {
    controller: ['$element', function($element) {
      this.$element = $element;
    }]
  };
}]);
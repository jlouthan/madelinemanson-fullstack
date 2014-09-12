'use strict';

/**
 * Adds a 'ui-scrollfix' class to the element when the page scrolls past it's position.
 * @param [offset] {int} optional Y-offset to override the detected offset.
 *   Takes 300 (absolute) or -300 or +300 (relative to detected)
 */
angular.module('cmsFrontendApp').directive('scrollfixDynamic', ['$window', '$timeout', function ($window, $timeout) {
  return {
    require: '^?uiScrollfixTarget',
    scope: {
      model: '=watchModel'
    },
    link: function (scope, elm, attrs, uiScrollfixTarget) {
      // angular.element(document).ready(function () {
        var top = elm[0].offsetTop,
          curr = elm[0],
          $target = uiScrollfixTarget && uiScrollfixTarget.$element || angular.element($window);

      while (curr = curr.offsetParent) {
        top += curr.offsetTop;
      }

      var timer = $timeout(function(){
        top = elm[0].offsetTop;
        if (!attrs.scrollfixDynamic) {
          attrs.uiScrollfix = top;
        }
        else if (typeof(attrs.scrollfixDynamic) === 'string') {
        // charAt is generally faster than indexOf: http://jsperf.com/indexof-vs-charat
          if (attrs.scrollfixDynamic.charAt(0) === '-') {
            attrs.uiScrollfix = top - parseFloat(attrs.scrollfixDynamic.substr(1));
          }
          else if (attrs.uiScrollfix.charAt(0) === '+') {
            attrs.uiScrollfix = top + parseFloat(attrs.scrollfixDynamic.substr(1));
          }
        }
      });

      scope.$watch('model', function(v) {
        top = elm[0].offsetTop;
        if (!attrs.scrollfixDynamic) {
          attrs.uiScrollfix = top;
        }
        else if (typeof(attrs.scrollfixDynamic) === 'string') {
        // charAt is generally faster than indexOf: http://jsperf.com/indexof-vs-charat
          if (attrs.scrollfixDynamic.charAt(0) === '-') {
            attrs.uiScrollfix = top - parseFloat(attrs.scrollfixDynamic.substr(1));
          }
          else if (attrs.uiScrollfix.charAt(0) === '+') {
            attrs.uiScrollfix = top + parseFloat(attrs.scrollfixDynamic.substr(1));
          }
        }
        // console.log("top is now " + top);
      });  

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
        var elmHeight = elm.height();
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
}])
.directive('scrollSpyBlocks', ['$window', '$timeout', function ($window, $timeout) {
  return {
    require: '^?uiScrollfixTarget',
    scope: {
      currentBlock: '='
    },
    link: function (scope, elm, attrs, uiScrollfixTarget) {
      // angular.element(document).ready(function () {
        var top = elm[0].offsetTop,
          curr = elm[0],
          $target = uiScrollfixTarget && uiScrollfixTarget.$element || angular.element($window);

      while (curr = curr.offsetParent) {
        top += curr.offsetTop;
      }

      var calcOffset = function(){
        var top = elm[0].offsetTop;
        if (!attrs.scrollfixDynamic) {
          attrs.uiScrollfix = top;
        }
        else if (typeof(attrs.scrollfixDynamic) === 'string') {
        // charAt is generally faster than indexOf: http://jsperf.com/indexof-vs-charat
          if (attrs.scrollfixDynamic.charAt(0) === '-') {
            attrs.uiScrollfix = top - parseFloat(attrs.scrollfixDynamic.substr(1));
          }
          else if (attrs.uiScrollfix.charAt(0) === '+') {
            attrs.uiScrollfix = top + parseFloat(attrs.scrollfixDynamic.substr(1));
          }
        }
      }

      var timer = $timeout(calcOffset);

      // since blocks can move up and down the page, we watch and recalculate their offset accordingly
      scope.$watch(function(){
        return elm[0].offsetTop;
      }, function(newVal, oldVal){
        console.log('y offset changed: ' + oldVal + ', ' + newVal);
        calcOffset();
        if(scope.currentBlock){
          scope.currentBlock.isActive = false;
        }
      });

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
        var elmHeight = elm.height();
        var topBoundary = attrs.uiScrollfix - 250;
        var bottomBoundary = topBoundary + elmHeight;
        if (!elm.hasClass('ui-scrollfix') && offset > topBoundary && offset < bottomBoundary) {
          elm.addClass('ui-scrollfix');
          if(scope.currentBlock){
            scope.currentBlock.isActive = true;
            // console.log(' block is activated: ');
            // console.log(scope.currentBlock);
          }
        } else if (elm.hasClass('ui-scrollfix') && (offset < topBoundary || offset > bottomBoundary)) {
          elm.removeClass('ui-scrollfix');
          if(scope.currentBlock){
            if(scope.currentBlock.isActive){
              scope.currentBlock.isActive = false;
              // console.log(' block is deactivated: ');
              // console.log(scope.currentBlock);
            }
          }
        }
        // if(elm.hasClass('ui-scrollfix') && offset > (attrs.uiScrollfix - 250 + elmHeight)){
        //   if(scope.currentBlock){
        //     elm.removeClass('ui-scrollfix');
        //     if(scope.currentBlock.isActive){
        //       scope.currentBlock.isActive = false;
        //       // console.log(' block is deactivated: ');
        //       // console.log(scope.currentBlock);
        //     }
        //   }
        // }
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
}]);
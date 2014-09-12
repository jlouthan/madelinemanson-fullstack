'use strict';

angular.module('cmsFrontendApp')
.directive('bsScrollspy', function($window, $location, $routeParams, $timeout) {

    var slice = Array.prototype.slice;

    var offset;
    var offsets = [];
    var targets = [];
    var activeTarget;

    var refresh = function(options) {
      offsets = [];
      targets = [];
      console.log(options.id);
      slice.call($("#"+options.id).find('li'))
        .map(function(el) {
          return [$($(el).find('a').attr('href')).offset().top, el];
        })
        .sort(function(a, b) {
          return a[0] - b[0];
        })
        .forEach(function(el) {
        console.log("offset: "+el[0]);
          offsets.push(el[0]);
          targets.push(el[1]);
        });

      if(options.offset) {
        offset = options.offset === 'auto' ? offsets.length && offsets[0] : options.offset * 1;
      }
    };

    var process = function(scope, el, options) {
      if(!offsets.length) return;
      var scrollTop = document.body.scrollTop + offset; //el[0].scrollTop + offset;
      var scrollHeight = document.body.scrollHeight; //el[0].scrollHeight || document.body.scrollHeight;
      // var maxScroll = scrollHeight - jqHeight(el[0]);
      if(scrollTop < offsets[0] && activeTarget !== targets[0]) {
        return activate(scope, targets[0], options);
      }
      // if(scrollTop > maxScroll) {
      //   // return activate(scope, targets[0]);
      // }
      for (var i = offsets.length; i>=0; i--) {
        if(activeTarget !== targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1])) {
          activate(scope, targets[i], options);
        }
      }
    };

    var activate = function(scope, selector, options) {

      // Save active target for process()

      // Toggle active class on elements
      $(activeTarget).removeClass('active');
      $($(activeTarget).find('a').attr('href')).removeClass('activeBlockSection');
      activeTarget = selector;
      $(activeTarget).addClass('active');
      $($(activeTarget).find('a').attr('href')).addClass('activeBlockSection');


      // Use $location.search to trigger dom changes
      //scope.$apply($location.search(options.search || 'page', selector));

    };

    return {
      restrict: 'EAC',
      link: function postLink(scope, iElement, iAttrs) {

        var refreshPositions = function() { refresh(iAttrs); };
        //var debouncedRefresh = debounce(refreshPositions, 300);

        scope.$on('$viewContentLoaded', refreshPositions);
        scope.$on('$includeContentLoaded', refreshPositions);
        scope.$on('allRendered', function(){
        	$timeout(refreshPositions,1000);
        });
        angular.element($window).bind('scroll', function() {
          process(scope, iElement, iAttrs);
        });

      }
    };

  });
'use strict';

angular.module('cmsFrontendApp')
  .directive('dropzone', function () {
    return {
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {

      	var config = scope.dropzoneConfig;
      	// create a Dropzone for the element with the given options
    	var dropzone = new Dropzone(element[0], config.options);
    	// bind the given event handlers
    	_.each(config.eventHandlers, function (handler, event) {
    		dropzone.on(event, handler);
    	});
      }
    };
  });

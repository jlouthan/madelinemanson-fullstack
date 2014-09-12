'use strict';

angular.module('cmsFrontendApp')
  .directive('subHeader', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        currentPage: "@",
        currentObject: "=currentObj",
        publish: "&publishFcn",
        unpublish: "&unpublishFcn",
        save: "&saveFcn",
        back: "&",
        isValid: "&formIsValid"
      },
      controller: function($scope){

      },
      templateUrl: 'views/subHeaderTemplate.html'
    };
  });

'use strict';

angular.module('cmsFrontendApp')
  .directive('subHeaderSimple', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller: function($scope){

      },
      templateUrl: 'views/subHeaderSimpleTemplate.html'
    };
  });
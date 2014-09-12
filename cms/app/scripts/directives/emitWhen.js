'use strict';

angular.module('cmsFrontendApp')
.directive("emitWhen", function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var params = scope.$eval(attrs.emitWhen),
                event = params.event,
                condition = params.condition;
            if (condition) {
                scope.$emit(event);
            }
        }
    }
});
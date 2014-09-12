angular.module('bDatepicker', []).
  directive('bDatepicker', function(){
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function($scope, element, attrs, controller) {
        var updateModel;
        updateModel = function(ev) {
          element.datetimepicker('hide');
          element.blur();
          return $scope.$apply(function() {
            return controller.$setViewValue(ev.date);
          });
        };
        if (controller != null) {
          controller.$render = function() {
            element.datetimepicker().data().datetimepicker.date = controller.$viewValue;
            element.datetimepicker('setValue', controller.$viewValue);
            element.datetimepicker('update');
            return controller.$viewValue;
          };
        }
        return attrs.$observe('bDatepicker', function(value) {
          var options;
          options = {};
          if (angular.isObject(value)) {
            options = value;
          }
          if (typeof(value) === "string" && value.length > 0) {
            options = angular.fromJson(value);
          }
          return element.datetimepicker(options).on('changeDate', updateModel);
        });
      }
    };
  });
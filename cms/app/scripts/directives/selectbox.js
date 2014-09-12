'use strict';

angular.module('cmsFrontendApp')
  .directive('ucsSelectBox', function ($timeout) {
    return {
      restrict: 'E',
      scope: {
      	ngModel: '=',
      	selectId: '@',
      	defaultText: '@',
      	selectOptions: '=',
        selectClass: '@'
      },
      template: '<select class="{{selectClass}}" id="{{selectId}}"></select>',
      link: function postLink(scope, element, attrs) {
        var idString = 'select#' + scope.selectId;

        $timeout(function(){
          $(idString).selectBoxIt({
            autoWidth: false,
            downArrowIcon: "icon-dropdown",
            defaultText: scope.defaultText,
            populate: scope.selectOptions
          });
          $(idString).bind({
            "change": function(){
              scope.ngModel = $(this).val();
              scope.$apply();
            }
          });
        });

        scope.$watch('defaultText', function(newVal){
          var selectBox = $(idString).data('selectBox-selectBoxIt');
          if(selectBox)selectBox.setOption('defaultText', newVal);
        });

      }
    };
  });

'use strict';

angular.module('cmsFrontendApp')
  .directive('inputWithCharacterBackground', function () {
    return {
    	restrict: 'A',
    	templateUrl: '/views/inputWithCharacterBackgroundTemplate.html',
    	scope: {
    		ngModel: '=',
    		inputName: '@',
    		icon: '@'
    	},
    	controller: function($scope, $element, $attrs){

    		$scope.toggleFocus = function(){
    			$scope.inputFocus = !$scope.inputFocus; 
    		};
    	},
    	link: function postLink(scope, element, attrs) {


    		scope.$watch('inputFocus', function(isFocused){
    			
    			var color = '';
    			if(isFocused){
    				color = "#f26a21";
    			}
    			else{
    				color = "#a6a6a6";
    			}
    			element.css('border-color', color);
    			element.children('.background-icon').css('color', color);

    		});
    	}
    };
  });

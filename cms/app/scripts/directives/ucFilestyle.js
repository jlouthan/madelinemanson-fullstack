'use strict';

angular.module('cmsFrontendApp')
.directive('ucFilestyle',function(){
	return function(scope, element, attrs){
		$(element).filestyle();
	};
});
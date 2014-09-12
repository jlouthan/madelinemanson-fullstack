'use strict';

angular.module('cmsFrontendApp')
  .service('loggedInChecker', [ '$rootScope', function($rootScope) {
  	$rootScope.userLoaded = false;

  	this.validateUser = function(){
  		dpd.users.me(function(user) {
		if(!user){
			location.href = '#!/login';
		}else{
			$rootScope.currentUser = user;
			$rootScope.userLoaded = true;
			$rootScope.$apply();
			// console.log('user is loaded');
			// $scope.avatarUrl = 'url(' + user.avatarUrl + ')';
		}
		});
  	};

  }]);
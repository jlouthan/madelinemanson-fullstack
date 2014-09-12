'use strict';

angular.module('cmsFrontendApp') 
.controller('LoginCtrl', function($scope, $rootScope, $location, $modal, $anchorScroll, loggedInChecker) {
  $rootScope.userLoaded = false;
  $anchorScroll();
  console.log('in the login controller');
  $rootScope.currentPage = 'login';

  function getMe() {
    loggedInChecker.validateUser();
  }
  getMe();


  $scope.showLogin = function(val) {
	$scope.loginVisible = val;
	if (val) {
		$scope.username = '';
		$scope.password = '';
	}
  };


  $scope.login = function() {
  	if(!$scope.username || !$scope.password){
  		$scope.launchErrorModal();
  		return;
  	}
	dpd.users.login({
		username: $scope.username,
		password: $scope.password
	}, function(session, error) {
		if (error) {
			$scope.launchErrorModal();
		} else {
			location.href='#!/dashboard';
			getMe();
		}
	});
  };

  $scope.launchErrorModal = function(){
  	var fieldType = 'loginError';
  	var modalInstance = $modal.open({
      templateUrl: 'views/loginErrorModalTemplate.html',
    });

    modalInstance.result.then(function () {
    	$scope.username = '';
    	$scope.password = '';
    }, function () {
    	$log.info('Modal dismissed at: ' + new Date());
    });

};

  $scope.logout = function() {
	dpd.users.logout(function() {
		$rootScope.currentUser = null;
		$scope.$apply();
		location.href='#!/login';
	});
  };

});
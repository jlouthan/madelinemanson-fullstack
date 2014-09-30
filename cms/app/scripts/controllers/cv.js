'use strict';

angular.module('cmsFrontendApp')
  .controller('CvCtrl', function ($scope, $rootScope, loggedInChecker, modalManager) {
  	loggedInChecker.validateUser();
  	$rootScope.currentPage = 'cv';
  	$scope.subHeaderText = 'cv';

  	dpd.cv.get(function(result, error){
  		if(error){
  			console.log('there was an error: ');
  			console.log(error);
  		}
  		else{
  			$scope.cv = result[0];
  			// console.log($scope.cv);
  			$scope.$apply();
  			$scope.cv.slug = 'cv';
  		}
  	});

    $scope.formIsValid = function(){
      if($scope.cv && $scope.cv.content){
        return true;
      }
      return false;
    };

  	$scope.save = function(){
      $scope.validSubmitted = false;
      if(!$scope.formIsValid()){
        $scope.invalidSubmitted = true;
        return false;
      }
  		dpd.cv.put($scope.cv, function(result, error){
  			if(error){
  				console.log('there was an error: ');
  				console.log(error);
          $scope.serverError = error;
  			}
  			else{
  				$scope.cv = result;
  				$scope.cv.slug = 'cv';
          $scope.validSubmitted = true;
  				$scope.$apply();
  			}
  		});
  	};

  });

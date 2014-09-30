'use strict';

angular.module('cmsFrontendApp')
  .controller('FriendCtrl', function ($scope, $rootScope, loggedInChecker, $anchorScroll, $routeParams, modalManager, $location) {
  	loggedInChecker.validateUser();
  	$rootScope.currentPage = 'friends';
  	$anchorScroll();
  	$scope.friendId = null;

  	if($routeParams.friendId){
  		$scope.friendId = $routeParams.friendId;
  		dpd.friends.get($scope.friendId, function(result, error){
  			if(error){
  				console.log('there was an error: ');
  				console.log(error);
  			}
  			else{
  				console.log(result);
  				$scope.friend = result;
  				$scope.subHeaderText = result.state === 'temp' ? 'friend-new' : 'friend';
  				$scope.$apply();
  			}
  		});
  	}
  	else{
  		$scope.friend = {'state': 'temp', 'createdBy': $rootScope.currentUser.id};
  		dpd.friends.post($scope.friend, function(result, error){
  			if(error){
  				console.log('there was an error');
  				console.log(error);
  			}
  			else{
  				location.href = '#!/friend/' + result.id;
  			}
  		});
  	}

  	$scope.back = function(){
		location.href = '#!/friends';
	};

	$scope.formIsValid = function(){
		if($scope.friend){
			if($scope.friend.name && $scope.friend.url){
				return true;
			}
		}
		return false;
	};

	$scope.updateFriend = function(){
		if($scope.friendId){
			dpd.friends.put($scope.friend, function(result, error){
				if(error){
					console.log('there was an error: ');
					console.log(error);
					$scope.serverError = error;
				}
				else{
					location.href='#!/friends';
				}
			});
		}
	};

	function setWeightingToLeast(){
		var query = {$sort: {weighting: 1}, id: {$ne: $scope.friendId}, state: 'published'};
		dpd.friends.get(query, function(results){
			if(results && results.length > 0 && results[0].weighting){
				var minWeight = results[0].weighting;
				$scope.friend.weighting = minWeight - 1;
			}
			else{
				$scope.friend.weighting = 20;
			}
			$scope.updateFriend();
		});
	};

	$scope.save = function(){
		if(!$scope.formIsValid()){
			$scope.invalidSubmitted = true;
			return false;
		}
		$scope.friend.state = 'published';
		$scope.friend.slug = convertToSlug($scope.friend.name);
		if(!$scope.friend.weighting){
			setWeightingToLeast();
		}
		else{
			$scope.updateFriend();
		}
	};


});
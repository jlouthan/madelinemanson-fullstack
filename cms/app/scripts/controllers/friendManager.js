'use strict';

angular.module('cmsFrontendApp')
  .controller('FriendManagerCtrl', function ($scope, $rootScope, $location, loggedInChecker, modalManager, weightUpdater) {
  	loggedInChecker.validateUser();
	$rootScope.currentPage = 'friends';

	var PAGE_SIZE = 15;

	var FriendFeeder = function FriendFeeder(query) {
		this.query = query || {};
		this.friends = [];
		this.moreToLoad = true;
  	};

  FriendFeeder.prototype.loadContents = function() {
  	var feed = this;
  	if(feed.moreToLoad){
  		this.moreToLoad = false;
  		var query = angular.copy(this.query);
  	query.$limit = PAGE_SIZE;
  	if(feed.friends){
		query.$skip = feed.friends.length;
	}
	query.$limit = PAGE_SIZE;
	query.$sort = {weighting: -1};
	query.state = "published";
	query.$fields = {name:1,url:1,dateCreated:1,weighting:1};
	dpd.friends.get(query, function(result) {
		if (result.length >= PAGE_SIZE) {
			// result.pop();
			feed.moreToLoad = true;
		} else {
			feed.moreToLoad = false;
		}
		Array.prototype.push.apply(feed.friends, result);
		$scope.friends = feed.friends;
		$scope.feed = feed;
		$scope.$apply();
	});
  	}
  };

	var feed = new FriendFeeder();
	// feed.loadContents();
	$scope.feed = feed;
	$scope.sortingOptions = weightUpdater.sortingOptions($scope.feed.friends, 'friends', $scope);


	$scope.openRemoveModal = function(friend){

		modalManager.removalModal(friend, 'friend').then(function(){
			$scope.feed.friends = _.without($scope.feed.friends, friend);
			friend.state = "deleted";
			dpd.friends.put(friend, function (err) {
				if(err) console.log(err);
			});
		});
	};
  });
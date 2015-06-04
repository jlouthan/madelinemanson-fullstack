'use strict';

angular.module('cmsFrontendApp')
  .controller('ObjectManagerCtrl', function ($scope, $rootScope, $location, loggedInChecker, modalManager, weightUpdater) {
  	loggedInChecker.validateUser();
	$rootScope.currentPage = 'things';

	var PAGE_SIZE = 10;

	var ObjectFeeder = function ObjectFeeder(query) {
		this.query = query || {};
		this.things = [];
		this.moreToLoad = true;
  	};

  ObjectFeeder.prototype.loadContents = function() {
  	var feed = this;
  	if(feed.moreToLoad){
  		this.moreToLoad = false;
  		var query = angular.copy(this.query);
  	query.$limit = PAGE_SIZE;
  	if(feed.things){
		query.$skip = feed.things.length;
	}
	query.$limit = PAGE_SIZE;
	query.$sort = {weighting: -1};
	query.state = "published";
	query.$fields = {name:1,thumbnail:1,dateCreated:1,weighting:1};
	dpd.things.get(query, function(result) {
		if (result.length >= PAGE_SIZE) {
			// result.pop();
			feed.moreToLoad = true;
		} else {
			feed.moreToLoad = false;
		}
		Array.prototype.push.apply(feed.things, result);
		$scope.things = feed.things;
		$scope.feed = feed;
		$scope.$apply();
	});
  	}
  };

	var feed = new ObjectFeeder();
	// feed.loadContents();
	$scope.feed = feed;
	$scope.sortingOptions = weightUpdater.sortingOptions($scope.feed.things, 'things', $scope);


	$scope.openRemoveModal = function(thing){

		modalManager.removalModal(thing, 'thing').then(function(){
			$scope.feed.things = _.without($scope.feed.things, thing);
			thing.state = "deleted";
			dpd.things.put(thing, function (err) {
				if(err) console.log(err);
			});
		});
	};
  });
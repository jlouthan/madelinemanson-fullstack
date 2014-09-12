'use strict';

angular.module('cmsFrontendApp')
  .controller('TextileManagerCtrl', function ($scope, $rootScope, $location, loggedInChecker, modalManager, weightUpdater) {
  	loggedInChecker.validateUser();
	$rootScope.currentPage = 'textiles';

	var PAGE_SIZE = 10;

	var TextileFeeder = function TextileFeeder(query) {
		this.query = query || {};
		this.textiles = [];
		this.moreToLoad = true;
  	};

  TextileFeeder.prototype.loadContents = function() {
  	var feed = this;
  	if(feed.moreToLoad){
  		this.moreToLoad = false;
  		var query = angular.copy(this.query);
  	query.$limit = PAGE_SIZE;
  	if(feed.textiles){
		query.$skip = feed.textiles.length;
	}
	query.$limit = PAGE_SIZE;
	query.$sort = {weighting: -1};
	query.state = "published";
	query.$fields = {name:1,thumbnail:1,dateCreated:1,weighting:1};
	dpd.textiles.get(query, function(result) {
		if (result.length >= PAGE_SIZE) {
			// result.pop();
			feed.moreToLoad = true;
		} else {
			feed.moreToLoad = false;
		}
		Array.prototype.push.apply(feed.textiles, result);
		$scope.textiles = feed.textiles;
		$scope.feed = feed;
		$scope.$apply();
	});
  	}
  };

	var feed = new TextileFeeder();
	// feed.loadContents();
	$scope.feed = feed;
	$scope.sortingOptions = weightUpdater.sortingOptions($scope.feed.textiles, 'textiles', $scope);


	$scope.openRemoveModal = function(textile){

		modalManager.removalModal(textile, 'textile').then(function(){
			$scope.feed.textiles = _.without($scope.feed.textiles, textile);
			textile.state = "deleted";
			dpd.textiles.put(textile, function (err) {
				if(err) console.log(err);
			});
		});
	};
  });
'use strict';

angular.module('cmsFrontendApp')
  .controller('QuiltManagerCtrl', function ($scope, $rootScope, $location, loggedInChecker, modalManager, weightUpdater) {
  	loggedInChecker.validateUser();
	$rootScope.currentPage = 'quilts';

	var PAGE_SIZE = 10;

	var QuiltFeeder = function QuiltFeeder(query) {
		this.query = query || {};
		this.quilts = [];
		this.moreToLoad = true;
  	};

  QuiltFeeder.prototype.loadContents = function() {
  	var feed = this;
  	if(feed.moreToLoad){
  		this.moreToLoad = false;
  		var query = angular.copy(this.query);
  	query.$limit = PAGE_SIZE;
  	if(feed.quilts){
		query.$skip = feed.quilts.length;
	}
	query.$limit = PAGE_SIZE;
	query.$sort = {weighting: -1};
	query.state = "published";
	query.$fields = {name:1,thumbnail:1,dateCreated:1,weighting:1};
	dpd.quilts.get(query, function(result) {
		if (result.length >= PAGE_SIZE) {
			// result.pop();
			feed.moreToLoad = true;
		} else {
			feed.moreToLoad = false;
		}
		Array.prototype.push.apply(feed.quilts, result);
		$scope.quilts = feed.quilts;
		$scope.feed = feed;
		$scope.$apply();
	});
  	}
  };

	var feed = new QuiltFeeder();
	// feed.loadContents();
	$scope.feed = feed;
	$scope.sortingOptions = weightUpdater.sortingOptions($scope.feed.quilts, 'quilts', $scope);


	$scope.openRemoveModal = function(quilt){

		modalManager.removalModal(quilt, 'quilt').then(function(){
			$scope.feed.quilts = _.without($scope.feed.quilts, quilt);
			quilt.state = "deleted";
			dpd.quilts.put(quilt, function (err) {
				if(err) console.log(err);
			});
		});
	};
  });
'use strict';

angular.module('cmsFrontendApp')
  .controller('PrintManagerCtrl', function ($scope, $rootScope, $location, loggedInChecker, modalManager, weightUpdater) {
  	loggedInChecker.validateUser();
	$rootScope.currentPage = 'prints';

	var PAGE_SIZE = 10;

	var PrintFeeder = function PrintFeeder(query) {
		this.query = query || {};
		this.prints = [];
		this.moreToLoad = true;
  	};

  PrintFeeder.prototype.loadContents = function() {
  	var feed = this;
  	if(feed.moreToLoad){
  		this.moreToLoad = false;
  		var query = angular.copy(this.query);
  	query.$limit = PAGE_SIZE;
  	if(feed.prints){
		query.$skip = feed.prints.length;
	}
	query.$limit = PAGE_SIZE;
	query.$sort = {weighting: -1};
	query.state = "published";
	query.$fields = {name:1,image:1,dateCreated:1,weighting:1};
	dpd.prints.get(query, function(result) {
		if (result.length >= PAGE_SIZE) {
			// result.pop();
			feed.moreToLoad = true;
		} else {
			feed.moreToLoad = false;
		}
		Array.prototype.push.apply(feed.prints, result);
		$scope.prints = feed.prints;
		$scope.feed = feed;
		$scope.$apply();
	});
  	}
  };

	var feed = new PrintFeeder();
	// feed.loadContents();
	$scope.feed = feed;
	$scope.sortingOptions = weightUpdater.sortingOptions($scope.feed.prints, 'prints', $scope);


	$scope.openRemoveModal = function(print){

		modalManager.removalModal(print, 'print').then(function(){
			$scope.feed.prints = _.without($scope.feed.prints, print);
			print.state = "deleted";
			dpd.prints.put(print, function (err) {
				if(err) console.log(err);
			});
		});
	};
  });
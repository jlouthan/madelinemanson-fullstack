'use strict';

angular.module('cmsFrontendApp')
  .controller('ObjectManagerCtrl', function ($scope, $rootScope, $location, loggedInChecker, modalManager, weightUpdater) {
  	loggedInChecker.validateUser();
	$rootScope.currentPage = 'objects';

	var PAGE_SIZE = 10;

	var ObjectFeeder = function ObjectFeeder(query) {
		this.query = query || {};
		this.objects = [];
		this.moreToLoad = true;
  	};

  ObjectFeeder.prototype.loadContents = function() {
  	var feed = this;
  	if(feed.moreToLoad){
  		this.moreToLoad = false;
  		var query = angular.copy(this.query);
  	query.$limit = PAGE_SIZE;
  	if(feed.objects){
		query.$skip = feed.objects.length;
	}
	query.$limit = PAGE_SIZE;
	query.$sort = {weighting: -1};
	query.state = "published";
	query.$fields = {name:1,thumbnail:1,dateCreated:1,weighting:1};
	dpd.objects.get(query, function(result) {
		if (result.length >= PAGE_SIZE) {
			// result.pop();
			feed.moreToLoad = true;
		} else {
			feed.moreToLoad = false;
		}
		Array.prototype.push.apply(feed.objects, result);
		$scope.objects = feed.objects;
		$scope.feed = feed;
		$scope.$apply();
	});
  	}
  };

	var feed = new ObjectFeeder();
	// feed.loadContents();
	$scope.feed = feed;
	$scope.sortingOptions = weightUpdater.sortingOptions($scope.feed.objects, 'objects', $scope);


	$scope.openRemoveModal = function(object){

		modalManager.removalModal(object, 'object').then(function(){
			$scope.feed.objects = _.without($scope.feed.objects, object);
			object.state = "deleted";
			dpd.objects.put(object, function (err) {
				if(err) console.log(err);
			});
		});
	};
  });
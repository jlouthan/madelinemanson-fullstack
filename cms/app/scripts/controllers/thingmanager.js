'use strict';

angular.module('cmsFrontendApp')
  .controller('ThingManagerCtrl', function ($scope, $location, $routeParams, $rootScope, $modal, loggedInChecker, listSorting, modalManager) {
  	loggedInChecker.validateUser();
	$rootScope.currentPage = 'thing';
	$scope.go = function(thing){
		location.href = '#!/thing/' + thing.id;
	};

	$scope.sortBy = function(property){
		if(property === 'title'){
			if($scope.sortedByTitleAZ){
				$scope.feed.things = listSorting.sortBy('titleZA', $scope.feed.things);
				$scope.sortedByTitleZA = true;
				$scope.sortedByTitleAZ = false;
			}
			else{
				$scope.feed.things = listSorting.sortBy('titleAZ', $scope.feed.things);
				$scope.sortedByTitleAZ = true;
				$scope.sortedByTitleZA = false;
			}
		}
	};

	$scope.remove = function(thing){
		$scope.feed.things = _.without($scope.feed.things, thing);
		// thing.state = "deleted";
		// dpd.things.put(thing, function (err) {
		// 	if(err) console.log(err);
		// });
	};

	$scope.openRemoveModal = function (thing) {
		modalManager.removalModal(thing, $scope.remove);
	};

	var PAGE_SIZE = 15;

  var ThingFeeder = function ThingFeeder(query) {
	this.query = query || {};
	this.things = [];
	this.moreToLoad = true;
  };

  ThingFeeder.prototype.loadContents = function() {
  	var feed = this;
  	if(feed.moreToLoad){
  		this.moreToLoad = false;
  		var query = angular.copy(this.query);
  	query.$limit = PAGE_SIZE;
  	if(feed.things){
		query.$skip = feed.things.length;
	}
	query.$sort = {lastSaved: -1};
	query.state = {$in: ["draft", "published"]};
	query.$fields = {title:1,datePublished:1,author:1,state:1};
	// Remove this after retrieving real content. This is just dummy data
	var date1 = new Date();
	var date2 = new Date("05/19/1956");
	var date3 = new Date("05/10/1960");
	feed.things = [ {'title': 'Thing 1', 'property1': 'Green', 'property2': 'Squiggly', 'state': 'published', 'date': date1, 'id': 1},
					{'title': 'Thing 2', 'property1': 'Yellow', 'property2': 'Scratchy', 'state': 'published', 'date': date2, 'id': 2},
					{'title': 'Thing 3', 'property1': 'Orange', 'property2': 'Bumpy', 'state': 'published', 'date': date3, 'id': 3}
					];
	// dpd.things.get(query, function(result) {
	// 	if (result.length >= PAGE_SIZE) {
	// 		// result.pop();
	// 		feed.moreToLoad = true;
	// 	} else {
	// 		feed.moreToLoad = false;
	// 	}

	// 	Array.prototype.push.apply(feed.things, result);
	// 	$scope.things = feed.things;
	// 	if($scope.sortedByTitleAZ){
	// 		$scope.feed.things = listSorting.sortBy('titleAZ', $scope.feed.things);
	// 	}
	// 	else if($scope.sortedByTitleZA){
	// 		$scope.feed.things = listSorting.sortBy('titleZA', $scope.feed.things);
	// 	}

	// 	$scope.$apply();
	// });
  	}
  };

	var feed = new ThingFeeder();
	$scope.feed = feed;

  });

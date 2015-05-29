'use strict';

angular.module('cmsFrontendApp')
  .controller('BookManagerCtrl', function ($scope, $rootScope, $location, loggedInChecker, modalManager, weightUpdater) {
  	loggedInChecker.validateUser();
	$rootScope.currentPage = 'books';

	var PAGE_SIZE = 10;

	var BookFeeder = function BookFeeder(query) {
		this.query = query || {};
		this.books = [];
		this.moreToLoad = true;
  	};

  BookFeeder.prototype.loadContents = function() {
  	var feed = this;
  	if(feed.moreToLoad){
  		this.moreToLoad = false;
  		var query = angular.copy(this.query);
  	query.$limit = PAGE_SIZE;
  	if(feed.books){
		query.$skip = feed.books.length;
	}
	query.$limit = PAGE_SIZE;
	query.$sort = {weighting: -1};
	query.state = "published";
	query.$fields = {name:1,thumbnail:1,dateCreated:1,weighting:1};
	dpd.books.get(query, function(result) {
		if (result.length >= PAGE_SIZE) {
			// result.pop();
			feed.moreToLoad = true;
		} else {
			feed.moreToLoad = false;
		}
		Array.prototype.push.apply(feed.books, result);
		$scope.books = feed.books;
		$scope.feed = feed;
		$scope.$apply();
	});
  	}
  };

	var feed = new BookFeeder();
	// feed.loadContents();
	$scope.feed = feed;
	$scope.sortingOptions = weightUpdater.sortingOptions($scope.feed.books, 'books', $scope);


	$scope.openRemoveModal = function(book){

		modalManager.removalModal(book, 'book').then(function(){
			$scope.feed.books = _.without($scope.feed.books, book);
			book.state = "deleted";
			dpd.books.put(book, function (err) {
				if(err) console.log(err);
			});
		});
	};
  });
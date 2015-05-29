'use strict';

angular.module('cmsFrontendApp')
  .controller('BookCtrl', function ($scope, $rootScope, loggedInChecker, $anchorScroll, $routeParams, modalManager, $location) {
  	loggedInChecker.validateUser();
  	$rootScope.currentPage = 'books';
  	$anchorScroll();
  	$scope.bookId = null;
  	$scope.availableBlocks = [{"name":"Fullsize Image","type":"image","id":"02ff9b74e90da8a0"}];

  	if($routeParams.bookId){
  		$scope.bookId = $routeParams.bookId;
  		dpd.books.get($scope.bookId, function(result, error){
  			if(error){
  				console.log('there was an error: ');
  				console.log(error);
  			}
  			else{
  				console.log(result);
  				$scope.book = result;
  				$scope.subHeaderText = result.state === 'temp' ? 'book-new' : 'book';
  				$scope.$apply();
  			}
  		});
  	}
  	else{
  		$scope.book = {'state': 'temp', 'createdBy': $rootScope.currentUser.id};
  		dpd.books.post($scope.book, function(result, error){
  			if(error){
  				console.log('there was an error');
  				console.log(error);
  			}
  			else{
  				location.href = '#!/book/' + result.id;
  			}
  		});
  	}

  	$scope.back = function(){
		location.href = '#!/books';
	};

	$scope.formIsValid = function(){
		if($scope.book){
			if($scope.book.name && $scope.book.images){
				return true;
			}
		}
		return false;
	};

	$scope.updateBook = function(){
		if($scope.bookId){
			dpd.books.put($scope.book, function(result, error){
				if(error){
					console.log('there was an error: ');
					console.log(error);
					$scope.serverError = error;
				}
				else{
					location.href='#!/books';
				}
			});
		}
	};

	function setWeightingToLeast(){
		var query = {$sort: {weighting: 1}, id: {$ne: $scope.bookId}, state: 'published'};
		dpd.books.get(query, function(results){
			if(results && results.length > 0 && results[0].weighting){
				var minWeight = results[0].weighting;
				$scope.book.weighting = minWeight - 1;
			}
			else{
				$scope.book.weighting = 20;
			}
			$scope.updateBook();
		});
	};

	$scope.save = function(){
		if(!$scope.formIsValid()){
			$scope.invalidSubmitted = true;
			return false;
		}
		$scope.book.state = 'published';
		$scope.book.slug = convertToSlug($scope.book.name);
		if(!$scope.book.weighting){
			setWeightingToLeast();
		}
		else{
			$scope.updateBook();
		}
	};

	// ~%~%~%~%~%~%~%Modal%~%~%~%~%~~%~

	$scope.openImageModal = function(block) {
		var modalObj = {};
		modalObj.hasAltText = true;
		modalObj.altText = block.imageAltText;
		modalObj.icon = 'icon-img';
		modalObj.templateUrl = '';

		modalObj.spec = 'at least px x px';
		modalObj.title = 'Book Image';
		modalObj.info = 'Image of the book to appear in thumbnail and carousel views.';
		modalObj.uploadUrl = '/resize-portfolio-image/' + $scope.book.id + '/image';

		modalManager.imageModal(modalObj).then(function(imageObj){
			block.image = imageObj.urls;
			block.imageAltText = imageObj.altText;
		});
  	};

  	$scope.blockImageThumbnail = function(block){
  		if($scope.book){
  			var urlObj = block.image;
  			if(urlObj){
  				return {backgroundImage: 'url(' + urlObj['carousel-xhdpi'] + ')'};
  			}
  		}
  		return '';
  	};

  	//!#!#!#!##!#!image blocks!@!@!@@!!@!@!@

  	$scope.scrollToBlock = function(blockId){
		var old = $location.hash();
		$location.hash('block' + blockId);
		$anchorScroll();
		$location.hash(old);
	};

	$scope.toggleDropdown = function(dropdown){
		$scope.dropdownShowing = !$scope.dropdownShowing;
	};

	$scope.addBlock = function (which){
		var clonedBlock = JSON.parse(JSON.stringify(which));
		clonedBlock.id = clonedBlock.id+"-"+generateUniqueId();
		if(!$scope.book.hasOwnProperty('images')){
			$scope.book.images = [];
		}
		$scope.book.images.push(clonedBlock);
		$scope.toggleDropdown();
		return false;
	};

	$scope.removeBlock = function (which){
		var index = $scope.book.images.indexOf(which);
		$scope.book.images.splice(index, 1);
	};

});
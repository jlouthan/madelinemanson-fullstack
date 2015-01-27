'use strict';

angular.module('cmsFrontendApp')
  .controller('TextileCtrl', function ($scope, $rootScope, loggedInChecker, $anchorScroll, $routeParams, modalManager, $location) {
  	loggedInChecker.validateUser();
  	$rootScope.currentPage = 'textiles';
  	$anchorScroll();
  	$scope.textileId = null;
  	$scope.availableBlocks = [{"name":"Fullsize Image","type":"image","id":"02ff9b74e90da8a0"}];

  	if($routeParams.textileId){
  		$scope.textileId = $routeParams.textileId;
  		dpd.textiles.get($scope.textileId, function(result, error){
  			if(error){
  				console.log('there was an error: ');
  				console.log(error);
  			}
  			else{
  				console.log(result);
  				$scope.textile = result;
  				$scope.subHeaderText = result.state === 'temp' ? 'textile-new' : 'textile';
  				$scope.$apply();
  			}
  		});
  	}
  	else{
  		$scope.textile = {'state': 'temp', 'createdBy': $rootScope.currentUser.id};
  		dpd.textiles.post($scope.textile, function(result, error){
  			if(error){
  				console.log('there was an error');
  				console.log(error);
  			}
  			else{
  				location.href = '#!/textile/' + result.id;
  			}
  		});
  	}

  	$scope.back = function(){
		location.href = '#!/textiles';
	};

	$scope.formIsValid = function(){
		if($scope.textile){
			if($scope.textile.name){
				console.log('returning valid form');
				return true;
			}
		}
		return false;
	};

	$scope.updateTextile = function(){
		if($scope.textileId){

			console.log($scope.textile);
			dpd.textiles.put($scope.textile, function(result, error){
				if(error){
					console.log('there was an error: ');
					console.log(error);
					$scope.serverError = error;
				}
				else{
					console.log('updated the textile!');
					location.href='#!/textiles';
				}
			});
		}
	};

	function setWeightingToLeast(){
		var query = {$sort: {weighting: 1}, id: {$ne: $scope.textileId}, state: 'published'};
		dpd.textiles.get(query, function(results){
			if(results && results.length > 0 && results[0].weighting){
				var minWeight = results[0].weighting;
				$scope.textile.weighting = minWeight - 1;
			}
			else{
				console.log('updating the weight');
				$scope.textile.weighting = 20;
			}
			$scope.updateTextile();
		});
	};

	$scope.save = function(){
		if(!$scope.formIsValid()){
			$scope.invalidSubmitted = true;
			return false;
		}
		$scope.textile.state = 'published';
		$scope.textile.slug = convertToSlug($scope.textile.name);
		if(!$scope.textile.weighting){
			setWeightingToLeast();
		}
		else{
			$scope.updateTextile();
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
		modalObj.title = 'Textile Image';
		modalObj.info = 'Image of the textile to appear in vertical scroll view.';
		modalObj.uploadUrl = '/resize-portfolio-image/' + $scope.textile.id + '/image';

		modalManager.imageModal(modalObj).then(function(imageObj){
			block.image = imageObj.urls;
			block.imageAltText = imageObj.altText;
		});
  	};

  	$scope.blockImageThumbnail = function(block){
  		if($scope.textile){
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

	$scope.addBlock = function (){
		var clonedBlock = {};
		clonedBlock.id = generateUniqueId();
		clonedBlock.name = "Fullsize Image";
		if(!$scope.textile.hasOwnProperty('images')){
			$scope.textile.images = [];
		}
		$scope.textile.images.push(clonedBlock);
		$scope.toggleDropdown();
		return false;
	};

	$scope.removeBlock = function (which){
		var index = $scope.textile.images.indexOf(which);
		$scope.textile.images.splice(index, 1);
	};

});
'use strict';

angular.module('cmsFrontendApp')
  .controller('QuiltCtrl', function ($scope, $rootScope, loggedInChecker, $anchorScroll, $routeParams, modalManager, $location) {
  	loggedInChecker.validateUser();
  	$rootScope.currentPage = 'quilts';
  	$anchorScroll();
  	$scope.quiltId = null;
  	$scope.availableBlocks = [{"name":"Fullsize Image","type":"image","id":"02ff9b74e90da8a0"}];

  	if($routeParams.quiltId){
  		$scope.quiltId = $routeParams.quiltId;
  		dpd.quilts.get($scope.quiltId, function(result, error){
  			if(error){
  				console.log('there was an error: ');
  				console.log(error);
  			}
  			else{
  				console.log(result);
  				$scope.quilt = result;
  				$scope.subHeaderText = result.state === 'temp' ? 'quilt-new' : 'quilt';
  				$scope.$apply();
  			}
  		});
  	}
  	else{
  		$scope.quilt = {'state': 'temp', 'createdBy': $rootScope.currentUser.id};
  		dpd.quilts.post($scope.quilt, function(result, error){
  			if(error){
  				console.log('there was an error');
  				console.log(error);
  			}
  			else{
  				location.href = '#!/quilt/' + result.id;
  			}
  		});
  	}

  	$scope.back = function(){
		location.href = '#!/quilts';
	};

	$scope.formIsValid = function(){
		if($scope.quilt){
			if($scope.quilt.name){
				console.log('returning valid form');
				return true;
			}
		}
		return false;
	};

	$scope.updateQuilt = function(){
		if($scope.quiltId){

			console.log($scope.quilt);
			dpd.quilts.put($scope.quilt, function(result, error){
				if(error){
					console.log('there was an error: ');
					console.log(error);
					$scope.serverError = error;
				}
				else{
					console.log('updated the quilt!');
					location.href='#!/quilts';
				}
			});
		}
	};

	function setWeightingToLeast(){
		var query = {$sort: {weighting: 1}, id: {$ne: $scope.quiltId}, state: 'published'};
		dpd.quilts.get(query, function(results){
			if(results && results.length > 0 && results[0].weighting){
				var minWeight = results[0].weighting;
				$scope.quilt.weighting = minWeight - 1;
			}
			else{
				console.log('updating the weight');
				$scope.quilt.weighting = 20;
			}
			$scope.updateQuilt();
		});
	};

	$scope.save = function(){
		if(!$scope.formIsValid()){
			$scope.invalidSubmitted = true;
			return false;
		}
		$scope.quilt.state = 'published';
		$scope.quilt.slug = convertToSlug($scope.quilt.name);
		if(!$scope.quilt.weighting){
			setWeightingToLeast();
		}
		else{
			$scope.updateQuilt();
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
		modalObj.title = 'Quilt Image';
		modalObj.info = 'Image of the quilt to appear in vertical scroll view.';
		modalObj.uploadUrl = '/resize-portfolio-image/' + $scope.quilt.id + '/image';

		modalManager.imageModal(modalObj).then(function(imageObj){
			block.image = imageObj.urls;
			block.imageAltText = imageObj.altText;
		});
  	};

  	$scope.blockImageThumbnail = function(block){
  		if($scope.quilt){
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
		if(!$scope.quilt.hasOwnProperty('images')){
			$scope.quilt.images = [];
		}
		$scope.quilt.images.push(clonedBlock);
		$scope.toggleDropdown();
		return false;
	};

	$scope.removeBlock = function (which){
		var index = $scope.quilt.images.indexOf(which);
		$scope.quilt.images.splice(index, 1);
	};

});
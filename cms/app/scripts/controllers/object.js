'use strict';

angular.module('cmsFrontendApp')
  .controller('ObjectCtrl', function ($scope, $rootScope, loggedInChecker, $anchorScroll, $routeParams, modalManager, $location) {
  	loggedInChecker.validateUser();
  	$rootScope.currentPage = 'objects';
  	$anchorScroll();
  	$scope.objectId = null;
  	$scope.availableBlocks = [{"name":"Fullsize Image","type":"image","id":"02ff9b74e90da8a0"}];

  	if($routeParams.objectId){
  		$scope.objectId = $routeParams.objectId;
  		dpd.objects.get($scope.objectId, function(result, error){
  			if(error){
  				console.log('there was an error: ');
  				console.log(error);
  			}
  			else{
  				console.log(result);
  				$scope.object = result;
  				$scope.subHeaderText = result.state === 'temp' ? 'object-new' : 'object';
  				$scope.$apply();
  			}
  		});
  	}
  	else{
  		$scope.object = {'state': 'temp', 'createdBy': $rootScope.currentUser.id};
  		dpd.objects.post($scope.object, function(result, error){
  			if(error){
  				console.log('there was an error');
  				console.log(error);
  			}
  			else{
  				location.href = '#!/object/' + result.id;
  			}
  		});
  	}

  	$scope.back = function(){
		location.href = '#!/objects';
	};

	$scope.formIsValid = function(){
		if($scope.object){
			if($scope.object.name && $scope.object.images){
				return true;
			}
		}
		return false;
	};

	$scope.updateObject = function(){
		if($scope.objectId){
			dpd.objects.put($scope.object, function(result, error){
				if(error){
					console.log('there was an error: ');
					console.log(error);
					$scope.serverError = error;
				}
				else{
					location.href='#!/objects';
				}
			});
		}
	};

	function setWeightingToLeast(){
		var query = {$sort: {weighting: 1}, id: {$ne: $scope.objectId}, state: 'published'};
		dpd.objects.get(query, function(results){
			if(results && results.length > 0 && results[0].weighting){
				var minWeight = results[0].weighting;
				$scope.object.weighting = minWeight - 1;
			}
			else{
				$scope.object.weighting = 20;
			}
			$scope.updateObject();
		});
	};

	$scope.save = function(){
		if(!$scope.formIsValid()){
			$scope.invalidSubmitted = true;
			return false;
		}
		$scope.object.state = 'published';
		$scope.object.slug = convertToSlug($scope.object.name);
		if(!$scope.object.weighting){
			setWeightingToLeast();
		}
		else{
			$scope.updateObject();
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
		modalObj.title = 'Object Image';
		modalObj.info = 'Image of the object to appear in thumbnail and carousel views.';
		modalObj.uploadUrl = '/resize-portfolio-image/' + $scope.object.id + '/image';

		modalManager.imageModal(modalObj).then(function(imageObj){
			block.image = imageObj.urls;
			block.imageAltText = imageObj.altText;
		});
  	};

  	$scope.blockImageThumbnail = function(block){
  		if($scope.object){
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
		if(!$scope.object.hasOwnProperty('images')){
			$scope.object.images = [];
		}
		$scope.object.images.push(clonedBlock);
		$scope.toggleDropdown();
		return false;
	};

	$scope.removeBlock = function (which){
		var index = $scope.object.images.indexOf(which);
		$scope.object.images.splice(index, 1);
	};

});
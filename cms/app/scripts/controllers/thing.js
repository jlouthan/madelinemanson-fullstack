'use strict';

angular.module('cmsFrontendApp')
  .controller('ObjectCtrl', function ($scope, $rootScope, loggedInChecker, $anchorScroll, $routeParams, modalManager, $location) {
  	loggedInChecker.validateUser();
  	$rootScope.currentPage = 'things';
  	$anchorScroll();
  	$scope.thingId = null;
  	$scope.availableBlocks = [{"name":"Fullsize Image","type":"image","id":"02ff9b74e90da8a0"}];

  	if($routeParams.thingId){
  		$scope.thingId = $routeParams.thingId;
  		dpd.things.get($scope.thingId, function(result, error){
  			if(error){
  				console.log('there was an error: ');
  				console.log(error);
  			}
  			else{
  				console.log(result);
  				$scope.thing = result;
  				$scope.subHeaderText = result.state === 'temp' ? 'thing-new' : 'thing';
  				$scope.$apply();
  			}
  		});
  	}
  	else{
  		$scope.thing = {'state': 'temp', 'createdBy': $rootScope.currentUser.id};
  		dpd.things.post($scope.thing, function(result, error){
  			if(error){
  				console.log('there was an error');
  				console.log(error);
  			}
  			else{
  				location.href = '#!/thing/' + result.id;
  			}
  		});
  	}

  	$scope.back = function(){
		location.href = '#!/things';
	};

	$scope.formIsValid = function(){
		if($scope.thing){
			if($scope.thing.name && $scope.thing.images){
				return true;
			}
		}
		return false;
	};

	$scope.updateObject = function(){
		if($scope.thingId){
			dpd.things.put($scope.thing, function(result, error){
				if(error){
					console.log('there was an error: ');
					console.log(error);
					$scope.serverError = error;
				}
				else{
					location.href='#!/things';
				}
			});
		}
	};

	function setWeightingToLeast(){
		var query = {$sort: {weighting: 1}, id: {$ne: $scope.thingId}, state: 'published'};
		dpd.things.get(query, function(results){
			if(results && results.length > 0 && results[0].weighting){
				var minWeight = results[0].weighting;
				$scope.thing.weighting = minWeight - 1;
			}
			else{
				$scope.thing.weighting = 20;
			}
			$scope.updateObject();
		});
	};

	$scope.save = function(){
		if(!$scope.formIsValid()){
			$scope.invalidSubmitted = true;
			return false;
		}
		$scope.thing.state = 'published';
		$scope.thing.slug = convertToSlug($scope.thing.name);
		if(!$scope.thing.weighting){
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
		modalObj.info = 'Image of the thing to appear in thumbnail and carousel views.';
		modalObj.uploadUrl = '/resize-portfolio-image/' + $scope.thing.id + '/image';

		modalManager.imageModal(modalObj).then(function(imageObj){
			block.image = imageObj.urls;
			block.imageAltText = imageObj.altText;
		});
  	};

  	$scope.blockImageThumbnail = function(block){
  		if($scope.thing){
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
		if(!$scope.thing.hasOwnProperty('images')){
			$scope.thing.images = [];
		}
		$scope.thing.images.push(clonedBlock);
		$scope.toggleDropdown();
		return false;
	};

	$scope.removeBlock = function (which){
		var index = $scope.thing.images.indexOf(which);
		$scope.thing.images.splice(index, 1);
	};

});
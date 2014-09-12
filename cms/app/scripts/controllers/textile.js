'use strict';

angular.module('cmsFrontendApp')
  .controller('TextileCtrl', function ($scope, $rootScope, loggedInChecker, $anchorScroll, $routeParams, modalManager) {
  	loggedInChecker.validateUser();
  	$rootScope.currentPage = 'textiles';
  	$anchorScroll();
  	$scope.textileId = null;

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
			if($scope.textile.name && $scope.textile.image){
				return true;
			}
		}
		return false;
	};

	$scope.updateTextile = function(){
		if($scope.textileId){
			dpd.textiles.put($scope.textile, function(result, error){
				if(error){
					console.log('there was an error: ');
					console.log(error);
					$scope.serverError = error;
				}
				else{
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

	$scope.openImageModal = function(imageName) {
		var modalObj = {};
		modalObj.hasAltText = true;
		modalObj.altText = $scope.textile.imageAltText;
		modalObj.icon = 'icon-img';
		modalObj.templateUrl = '';

		modalObj.spec = 'at least px x px';
		modalObj.title = 'Textile Image';
		modalObj.info = 'Image of the textile to appear in vertical scroll view.';
		modalObj.uploadUrl = '/resize-portfolio-image/' + $scope.textile.id + '/image';

		modalManager.imageModal(modalObj).then(function(imageObj){
			$scope.textile.image = imageObj.urls;
			$scope.textile.imageAltText = imageObj.altText;
		});
  	};

  	$scope.imageThumbnail = function(imageName){
  		if($scope.textile){
  			var urlObj = $scope.textile[imageName];
  			if(urlObj){
  				return {backgroundImage: 'url(' + urlObj.xhdpi + ')'};
  			}
  		}
  		return '';
  	};

});
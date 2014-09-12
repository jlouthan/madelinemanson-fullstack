'use strict';

angular.module('cmsFrontendApp')
  .controller('PrintCtrl', function ($scope, $rootScope, loggedInChecker, $anchorScroll, $routeParams, modalManager) {
  	loggedInChecker.validateUser();
  	$rootScope.currentPage = 'prints';
  	$anchorScroll();
  	$scope.printId = null;

  	if($routeParams.printId){
  		$scope.printId = $routeParams.printId;
  		dpd.prints.get($scope.printId, function(result, error){
  			if(error){
  				console.log('there was an error: ');
  				console.log(error);
  			}
  			else{
  				console.log(result);
  				$scope.print = result;
  				$scope.subHeaderText = result.state === 'temp' ? 'print-new' : 'print';
  				$scope.$apply();
  			}
  		});
  	}
  	else{
  		$scope.print = {'state': 'temp', 'createdBy': $rootScope.currentUser.id};
  		dpd.prints.post($scope.print, function(result, error){
  			if(error){
  				console.log('there was an error');
  				console.log(error);
  			}
  			else{
  				location.href = '#!/print/' + result.id;
  			}
  		});
  	}

  	$scope.back = function(){
		location.href = '#!/prints';
	};

	$scope.formIsValid = function(){
		if($scope.print){
			if(print.name && print.image){
				return true;
			}
		}
		return false;
	};

	$scope.updatePrint = function(){
		if($scope.printId){
			dpd.prints.put($scope.print, function(result, error){
				if(error){
					console.log('there was an error: ');
					console.log(error);
					$scope.serverError = error;
				}
				else{
					location.href='#!/prints';
				}
			});
		}
	};

	function setWeightingToLeast(){
		var query = {$sort: {weighting: 1}, id: {$ne: $scope.printId}, state: 'published'};
		dpd.prints.get(query, function(results){
			if(results && results.length > 0 && results[0].weighting){
				var minWeight = results[0].weighting;
				$scope.print.weighting = minWeight - 1;
			}
			else{
				$scope.print.weighting = 20;
			}
			$scope.updatePrint();
		});
	};

	$scope.save = function(){
		if(!$scope.formIsValid()){
			$scope.invalidSubmitted = true;
			return false;
		}
		$scope.print.state = 'published';
		$scope.print.slug = convertToSlug($scope.print.name);
		if(!$scope.print.weighting){
			setWeightingToLeast();
		}
		else{
			$scope.updatePrint();
		}
	};

	// ~%~%~%~%~%~%~%Modal%~%~%~%~%~~%~

	$scope.openImageModal = function(imageName) {
		var modalObj = {};
		modalObj.hasAltText = true;
		modalObj.altText = $scope.print.imageAltText;
		modalObj.icon = 'icon-img';
		modalObj.templateUrl = '';

		modalObj.spec = 'at least px x px';
		modalObj.title = 'Print Image';
		modalObj.info = 'Image of the print to appear in vertical scroll view.';
		modalObj.uploadUrl = '/resize-portfolio-image/' + $scope.print.id + '/image';

		modalManager.imageModal(modalObj).then(function(imageObj){
			$scope.print.image = imageObj.urls;
			$scope.print.imageAltText = imageObj.altText;
		});
  	};

  	$scope.imageThumbnail = function(imageName){
  		if($scope.print){
  			var urlObj = $scope.print[imageName];
  			if(urlObj){
  				return {backgroundImage: 'url(' + urlObj.xhdpi + ')'};
  			}
  		}
  		return '';
  	};

});
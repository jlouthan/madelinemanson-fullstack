'use strict';

angular.module('cmsFrontendApp')
  .controller('EtcCtrl', function ($scope, $rootScope, loggedInChecker, modalManager) {
  	loggedInChecker.validateUser();
  	$rootScope.currentPage = 'etc';
  	$scope.subHeaderText = 'etc';

  	dpd.etc.get(function(result, error){
  		if(error){
  			console.log('there was an error: ');
  			console.log(error);
  		}
  		else{
  			$scope.etc = result[0];
  			// console.log($scope.etc);
  			$scope.$apply();
  			$scope.etc.slug = 'etc';
  		}
  	});

    $scope.formIsValid = function(){
      if($scope.etc && $scope.etc.homeImage && $scope.etc.aboutImage && $scope.etc.friendsImage){
        return true;
      }
      return false;
    };

  	$scope.save = function(){
      $scope.validSubmitted = false;
      if(!$scope.formIsValid()){
        $scope.invalidSubmitted = true;
        return false;
      }
  		dpd.etc.put($scope.etc, function(result, error){
  			if(error){
  				console.log('there was an error: ');
  				console.log(error);
          $scope.serverError = error;
  			}
  			else{
  				$scope.etc = result;
  				$scope.etc.slug = 'etc';
          $scope.validSubmitted = true;
  				$scope.$apply();
  			}
  		});
  	};

    // ~%~%~%~%~%~%~%Modal%~%~%~%~%~~%~

  $scope.openImageModal = function(imageName) {
    var modalObj = {};
    modalObj.hasAltText = true;
    modalObj.altText = $scope.etc[imageName + 'altText'];
    modalObj.icon = 'icon-img';
    modalObj.templateUrl = '';
    if(imageName === 'homeImage'){
      modalObj.title = 'Home Page Image';
      modalObj.info = 'Large image shown on the home page.';
      modalObj.uploadUrl = '/resize-home-image/' + $scope.etc.id;
      modalObj.spec = 'at least 1152px x 550px';
    }
    else if(imageName === 'aboutImage'){
      modalObj.title = 'About Page Image';
      modalObj.info = 'Image shown on the about page.';
      modalObj.uploadUrl = '/resize-about-image/' + $scope.etc.id;
      modalObj.spec = 'at least 1152px x 550px';
    }
    else{
      modalObj.title = 'Friends Page Image';
      modalObj.info = 'Image shown on the friends page.';
      modalObj.uploadUrl = '/resize-about-image/' + $scope.etc.id;
      modalObj.spec = 'at least 1152px x 550px';
    }
    modalManager.imageModal(modalObj).then(function(imageObj){
      $scope.etc[imageName] = imageObj.urls;
      $scope.etc[imageName + 'altText'] = imageObj.altText;
    });
    };

    $scope.imageThumbnail = function(imageName){
      if($scope.etc){
        var urlObj = $scope.etc[imageName];
        if(urlObj){
          return {backgroundImage: 'url(' + urlObj.xhdpi + ')'};
        }
      }
      return '';
    };

  });

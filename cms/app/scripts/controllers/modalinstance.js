// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service.

var ModalInstanceCtrl = ['$scope', '$http', '$modalInstance', 'modalObj', function ($scope, $http, $modalInstance, modalObj) {

	$scope.modalObj = modalObj;
	$scope.imageObj = {};
	$scope.imageObj.altText = $scope.modalObj.altText || '';
	$scope.submitClass = "inactive";

	$scope.uploadFile = function(file){
		$scope.uploading = true;
		$scope.$apply();
		console.log("the upload url is " + $scope.modalObj.uploadUrl);
		var fd = new FormData();
		fd.append("file", file);
		var url = 'http://sbapi.uncorkedstudios.com' + $scope.modalObj.uploadUrl;
		$http.post(url, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).success(function(response){
			// $scope.uploading = false;
			$scope.submitClass = "";
			$scope.submitEnabled = true;
			$scope.imageObj.urls = response;
			console.log("success");
			console.log("response is " + JSON.stringify(response));
		});
	};

	$scope.dropzoneConfig = {
		'options': { // passed into the Dropzone constructor
			'url': '/',
			'createImageThumbnails': false
		},
		'eventHandlers': {
			'addedfile': function (file){
				$scope.uploadFile(file);
			},
			'success': function(file, response){
				// console.log("we have success with response " + response);
			},
			'accept': function(file, done){
				done("NOT DONE!");
			}
		}
	};


  $scope.ok = function () {
    $modalInstance.close($scope.imageObj);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}];
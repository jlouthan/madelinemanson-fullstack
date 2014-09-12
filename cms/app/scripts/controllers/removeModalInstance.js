// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service.

var RemoveModalInstanceCtrl = ['$scope', '$modalInstance', 'obj', 'type', function ($scope, $modalInstance, obj, type) {
	$scope.objTitle = obj.name;
	$scope.objType = type;
	$scope.obj = obj;

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}];

var EditModalInstanceCtrl = ['$scope', '$modalInstance', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}];
'use strict';

angular.module('cmsFrontendApp')
  .service('modalManager', [ '$modal', function modalManager($modal) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.imageModal = function(modalObj){
    	var modalInstance = $modal.open({
  			templateUrl: 'views/imageModalTemplate.html',
  			controller: ModalInstanceCtrl,
  			resolve: {
  				modalObj: function () {
  					return modalObj;
  				}
      		}
    	});

    	var promise = modalInstance.result.then(function (imageObj) {
    		return imageObj;
    	});
    	return promise;
    },

    this.removalModal = function(item, type){
    	
    	var modalInstance = $modal.open({
			templateUrl: 'views/removeModalTemplate.html',
			controller: RemoveModalInstanceCtrl,
			resolve: {
				obj: function () {
					return item;
				},
				type: function() {
					return type;
				}
			}
		});

		var promise = modalInstance.result.then(function(){
			return;
		});
		return promise;
    },

    this.editModal = function(){
      var modalInstance = $modal.open({
        templateUrl: 'views/editModalTemplate.html',
        controller: EditModalInstanceCtrl
      });

      var promise = modalInstance.result.then(function(){
        return;
      });
      return promise;
    };

    this.archiveBeerModal = function(beer, archiving){
      var modalInstance = $modal.open({
        templateUrl: 'views/archiveBeerModalTemplate.html',
        controller: ArchiveBeerModalInstanceCtrl,
        resolve: {
          beerObj: function () {
            return beer;
          },
          archiving: function () {
            return archiving;
          }
        }
      });

      var promise = modalInstance.result.then(function (beerObj){
        return beerObj;
      });
      return promise;
    }

  }]);

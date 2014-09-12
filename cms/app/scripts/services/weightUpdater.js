'use strict';

angular.module('cmsFrontendApp')
  .service('weightUpdater', function Weightupdater() {
    var maxWeight = 20;

  	var updateWeights = this.updateWeights = function(objects, objType, scope){
    	for(var i = 0; i < objects.length; i++){
        if(objects[i].status && objects[i].status === 'brewing now'){

        }
        else{
    		  objects[i].weighting = maxWeight - i;
    		  dpd[objType].put(objects[i], function(result, error){
    			 if(error){
    				  console.log('an error occurred updating weights');
    			 }
    		  });
        }
    	}
      if(!scope.$$phase) {
        scope.$apply();
      }
    };

  	this.sortingOptions = function(objects, objType, scope, disableSelector){
      var sortableItems = disableSelector || "> *";
  		var options = {
        scroll: false,
        items: sortableItems,
  			stop: function(event, ui){
				updateWeights(objects, objType, scope);
			},
			helper: function(event, ui){
				var $originals = ui.children();
        var $helper = ui.clone();
        $helper.children().each(function(index)
        {
          // Set helper cell sizes to match the original sizes
          $(this).width($originals.eq(index).width());
        });
        return $helper;
			}
  		};

  		return options;
  	}
  });

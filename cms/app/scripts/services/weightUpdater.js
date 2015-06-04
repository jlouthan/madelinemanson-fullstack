'use strict';

angular.module('cmsFrontendApp')
  .service('weightUpdater', function Weightupdater() {
    var maxWeight = 20;

  	var updateWeights = this.updateWeights = function(things, objType, scope){
    	for(var i = 0; i < things.length; i++){
        if(things[i].status && things[i].status === 'brewing now'){

        }
        else{
    		  things[i].weighting = maxWeight - i;
    		  dpd[objType].put(things[i], function(result, error){
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

  	this.sortingOptions = function(things, objType, scope, disableSelector){
      var sortableItems = disableSelector || "> *";
  		var options = {
        scroll: false,
        items: sortableItems,
  			stop: function(event, ui){
				updateWeights(things, objType, scope);
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

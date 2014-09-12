'use strict';

angular.module('cmsFrontendApp')
  .service('listSorting', function listSorting() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.sortAZ = function(a,b){
    	if(a.title.toUpperCase() < b.title.toUpperCase())
			return -1;
		if(a.title.toUpperCase() > b.title.toUpperCase())
			return 1;
		return 0;
    },

    this.sortZA = function(a,b){
    	if(a.title.toUpperCase() > b.title.toUpperCase())
			return -1;
		if(a.title.toUpperCase() < b.title.toUpperCase())
			return 1;
		return 0;
    },

    this.sortBy = function(property, items){
    	if(property === 'titleZA'){
    		items.sort(this.sortZA);
    	}
    	else{
    		items.sort(this.sortAZ);
    	}
    	return items;
    }

  });

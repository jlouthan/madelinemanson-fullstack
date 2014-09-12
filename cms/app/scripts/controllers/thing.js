'use strict';

angular.module('cmsFrontendApp')
  .controller('ThingCtrl', function ($scope, $location, $routeParams, $rootScope, $compile, $modal, $log, blockInfo, $anchorScroll, loggedInChecker) {
  	loggedInChecker.validateUser();
  	$rootScope.currentPage = 'thing';
  	$scope.subHeaderText = 'thing';
  	$anchorScroll();
	$scope.selectedTag = undefined;
	$scope.validTags = ['Research', 'Strategy', 'Concepting', 'Branding', 'Photography', 'Information Architecture', 'Experience Design', 'Interactive Design', 
						'Visual Design', 'Industrial Design', 'System Architecture', 'Front End Development', 'Back End Development', 'Mobile Web', 'iOS/Android Native', 'Hardware Prototyping',
						'Testing + Stabilization', 'Maintenance'];
	$scope.validTagsCopy = $scope.validTags.slice(0);
	$scope.tagColumn = [];
	setTagCols();
	$scope.thingId = null;
	$scope.availableBlocks = [{"name":"Pull quote","type":"pullQuote","id":"02ff9b74e90da8a0"},{"name":"Video embed","type":"video","id":"1d3c508b08eec8e3"},{"name":"2/3 Image left","type":"23left","id":"40736eaa1fba4b0a"},{"name":"Full-bleed image","type":"fullBleed","id":"61deff5184d5f80d"},{"name":"Code snippet","type":"code","id":"67165ff57b55ebf8"},{"name":"Fullsize image","type":"image","id":"b525748a7ed128e5"},{"name":"Body copy","type":"body","id":"b9134abdabd97869"},{"name":"2/3 Video right","type":"23rightVideo","id":"bab43ae2a9f0285c"},{"name":"2/3 Image right","type":"23right","id":"d2be0582f227c897"},{"name":"2/3 Video left","type":"23leftVideo","id":"db1384dd300379fc"}];
	$scope.selectVals = ['Option1', 'Option2', 'Option3', 'Option4'];

	if(!$rootScope.currentUser){
		location.href="#!/thing";
	}
	else{
		$scope.thing = {selectVal:{"id":$rootScope.currentUser.id, "firstName":$rootScope.currentUser.firstName, "lastName":$rootScope.currentUser.lastName},blocks:[],state:"temp"};
		$scope.thing.blocks = $scope.availableBlocks;
		$scope.thing.tags = [];
		if($routeParams.thingId){
			$scope.thingId = $routeParams.thingId;
			// Get the thing by its ID from deployd, and do all the necessary setup
		}
		else{

		}
	}

	// var blockQuery = {"category":"thing"};
	// dpd.blocks.get(function (result) {
	// 	$scope.availableBlocks = result;
	// });
	// fake it since there is no thing endpoint. just show all the blocks built so far
	// $scope.availableBlocks = [{"name":"Pull quote","type":"pullQuote","id":"02ff9b74e90da8a0"},{"name":"Video embed","type":"video","id":"1d3c508b08eec8e3"},{"name":"2/3 Image left","type":"23left","id":"40736eaa1fba4b0a"},{"name":"Full-bleed image","type":"fullBleed","id":"61deff5184d5f80d"},{"name":"Code snippet","type":"code","id":"67165ff57b55ebf8"},{"name":"Fullsize image","type":"image","id":"b525748a7ed128e5"},{"name":"Body copy","type":"body","id":"b9134abdabd97869"},{"name":"2/3 Video right","type":"23rightVideo","id":"bab43ae2a9f0285c"},{"name":"2/3 Image right","type":"23right","id":"d2be0582f227c897"},{"name":"2/3 Video left","type":"23leftVideo","id":"db1384dd300379fc"}];
	// ~*~*~*~METHODS~*~*~*~


	// #~#~#~#~##~ SELECT BOX #~#~#~###~#

	// TODO: move this code for selectBoxIt into a directive
	$scope.thingSelectVal = {"label": "Select Option 1"};
	$('select').selectBoxIt({
		autoWidth: false,
		downArrowIcon: "icon-dropdown",
		defaultText: $scope.thingSelectVal.label,
		populate: $scope.selectVals
	});
	var selectBox = $('select').data('selectBox-selectBoxIt');
	$('select').bind({
		"change": function(){
			$scope.changeSelectVal($(this).val());
		}
	});

	$scope.changeSelectVal = function(newVal){
		$scope.thing.someValue = newVal;
	};

	// ~#~#~#~#~##~#TAG INPUT~#~##~#~##~#

	$scope.getValidTags = function(){
		$scope.typingTag = true;
		if($scope.potentialTag === ''){
			$scope.typingTag = false;
		}
		var potentialTagChar = $scope.potentialTag.length;
		var tempTags = [];
		for(var i=0; i < $scope.validTagsCopy.length; i++){
			if($scope.potentialTag.toUpperCase() === $scope.validTagsCopy[i].slice(0,potentialTagChar).toUpperCase()){
				tempTags.push($scope.validTagsCopy[i]);
			}
		}
		$scope.validTags = tempTags;
		setTagCols();
	};


	function setTagCols(){
		var minTagsPerCol = Math.floor($scope.validTags.length / 3);
		var extraTags = $scope.validTags.length % 3;
		var colsWithMinTags = 3 - extraTags;
		var i = 0;
		while(i < colsWithMinTags){
			$scope.tagColumn[i] = $scope.validTags.splice(0, minTagsPerCol);
			i++;
		}
		while(i < 3){
			$scope.tagColumn[i] = $scope.validTags.splice(0, minTagsPerCol + 1);
			i++;
		}
	};

	// method to call on enter press
	$scope.setTag = function(tag){
		console.log("called it");
		if(typeof(tag) === 'undefined'){
			for(var i=0; i <3; i++){
				if($scope.tagColumn[i].length > 0){
					if($scope.thing.tags.indexOf($scope.tagColumn[i][0]) == -1){
						$scope.thing.tags.push($scope.tagColumn[i][0]);
						$scope.potentialTag = "";
						$scope.getValidTags();
					}
					break;
				}
			}
		}
		else{
			if($scope.thing.tags.indexOf(tag) == -1){
				$scope.thing.tags.push(tag);
			}
		}
	};

	$scope.removeTag = function(tag){
		console.log("selected tag is " + tag);
		var index = $scope.thing.tags.indexOf(tag);
		var numTags = $scope.thing.tags.length;
		$scope.thing.tags.splice(index, 1);
	};



	// ~~~~~~METHODS FOR BLOCKS~~~~~~~~

	$scope.addBlock = function (which){
		var clonedBlock = JSON.parse(JSON.stringify(which));
		clonedBlock.id = clonedBlock.id+"-"+generateUniqueId();
		if(!$scope.thing.hasOwnProperty('blocks')){
			$scope.thing.blocks = [];
		}
		$scope.thing.blocks.push(clonedBlock);
		$scope.toggleDropdown();
		return false;
	};

	$scope.removeBlock = function (which){
		var index = $scope.thing.blocks.indexOf(which);
		$scope.thing.blocks.splice(index, 1);
	};

	// return the block name we want to display to the user
	$scope.getBlockNameFromType = function(blockType){
		return blockInfo.getNameFromBlockType(blockType);
	};

	$scope.getIconFromBlockType = function(blockType){
		return blockInfo.getIconFromBlockType(blockType);
	};

	$scope.toggleDropdown = function(dropdown){
		$scope.dropdownShowing = !$scope.dropdownShowing;
	};

	$scope.scrollToBlock = function(blockId){
		var old = $location.hash();
		$location.hash('block' + blockId);
		$anchorScroll();
		$location.hash(old);
	};

	$scope.openImageModal = function (fieldType) {
	if(fieldType.name){
		var isBlock = true;
  		var uploadUrl = blockInfo.getUrlForBlockType(fieldType.type);
  	}
  	else{
  		var uploadUrl = blockInfo.getUrlForBlockType(fieldType);
  	}

  	uploadUrl = uploadUrl + $scope.thing.id;

    var modalInstance = $modal.open({
      templateUrl: 'views/imageModalTemplate.html',
      controller: ModalInstanceCtrl,
      resolve: {
        fieldType: function () {
        	if(isBlock){
        		return fieldType.type;
        	}
        	return fieldType;
        },
        uploadUrl: function() {
        	return uploadUrl;
        },
        currentPage: function() {
        	return 'blog';
        }
      }
    });

    modalInstance.result.then(function (imageObj) {
      if(fieldType === 'Blog Teaser Image'){
      	$scope.thing.teaserImage = imageObj.urls;
      }
      else if(fieldType === 'Hero Parallax Image'){
      	$scope.thing.heroImage = imageObj.urls;
      }
      else if(isBlock){
      	fieldType.imageUrl = imageObj.urls;
      	fieldType.alt = imageObj.altText;
      }
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }; 

  $scope.shouldDisplayThumb = function(field){
  	if(!$scope.thing){
  		return false;
  	}

  	if(field === 'Blog Teaser Image'){
  		if($scope.thing.teaserImage){
  			if($scope.thing.teaserImage.mdpi){
  				return true;
  			}
  		}
  		return false;
  	}
  	if(field === 'Hero Parallax Image'){
  		if($scope.thing.heroImage){
  			if($scope.thing.heroImage.mdpi){
  				return true;
  			}
  		}
  		return false;
  	}
  return false;
  };

  $scope.imageThumbnail = function(field){
  	if($scope.shouldDisplayThumb(field)){
  		if(field === 'Blog Teaser Image'){
  			var urlObj = $scope.thing.teaserImage;
  		}
  		else if(field === 'Hero Parallax Image'){
  			var urlObj = $scope.thing.heroImage;
  		}
  		return {
  			backgroundImage: 'url(' + urlObj.mdpi + ')'
  		};
  	}
  	return '';
  };

  $scope.blockShouldDisplayThumb = function(block){
  	if(block.imageUrl){
  		if(block.imageUrl.mdpi){
  			return true;
  		}
  	}
  	return false;
  }

  $scope.blockImageThumbnail = function(block){
  	if($scope.blockShouldDisplayThumb(block)){
  		return {
  			backgroundImage: 'url(' + block.imageUrl.mdpi + ')'
  		};
  	}
  };



	// ~!@#@!~#!~#SUBMITTING THE THING~~@!#~@#@#$!@#$@

	$scope.formIsValid = function(){
		// return false under invalid conditions and true when valid
		if($scope.thing){
			return true;
		}
		return false;
	}

	$scope.save = function(thing) {
		if(this.thingForm.$invalid){
			console.log("INVALID");
			return false;
		}
		$scope.thing.lastSaved = new Date().getTime();
		if($scope.thing.state == "temp")$scope.thing.state = "draft";
		if(!$scope.thing.datePublished)$scope.thing.slug = convertToSlug($scope.thing.title);
		if($scope.thingId){
			$scope.remapSelectVal();
			// put the thing to dpd and change lastSaved time in controller
		}
	};

	$scope.publish = function(thing) {
		if(this.blogForm.$invalid)return false;
		if(!$scope.thing.datePublished)$scope.thing.datePublished = new Date().getTime();
		if(!$scope.thing.slug){
			$scope.thing.slug  = convertToSlug($scope.thing.title);
		}
		$scope.thing.state = "published";
		if($scope.thingId){
			//validate blocks
			$scope.remapSelectVal();
			// put the thing to dpd and redirect to #!/thing
		}
	};
	$scope.unpublish = function(thing) {
		$scope.thing.state = "draft";
		$scope.save();
		$scope.startAutoSave();
	};
	$scope.startAutoSave = function(){
		$scope.autoSaveTimer = setTimeout(function(){
			$scope.autoSave();
		},10000);
	};
	$scope.autoSave = function(){
		if($location.$$path == '/blog/'+$scope.thingId){
			if($scope.blogForm.$dirty && $scope.formIsValid()){
				$scope.save();
			}
			$scope.startAutoSave();
		}
	}
	$scope.stopAutoSave = function(){
		clearTimeout($scope.autoSaveTimer);
	};

	$scope.stopAutoSave();

	$scope.back = function(){
		$scope.stopAutoSave();
		$location.path('/blog').replace();
	};

  });

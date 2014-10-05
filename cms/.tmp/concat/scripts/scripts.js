'use strict';
var app = angular.module('cmsFrontendApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'monospaced.elastic',
    'ui.sortable',
    'bDatepicker',
    'ui.scrollfix',
    'ui.keypress',
    'ngAnimate',
    'ui.bootstrap.modal',
    'ui.bootstrap.transition',
    'rzModule',
    'infinite-scroll',
    'ngQuickDate'
  ]);
app.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/', { redirectTo: '/prints' }).when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    }).when('/prints', {
      templateUrl: 'views/printManager.html',
      controller: 'PrintManagerCtrl'
    }).when('/print/new', {
      templateUrl: 'views/print.html',
      controller: 'PrintCtrl'
    }).when('/print/:printId', {
      templateUrl: 'views/print.html',
      controller: 'PrintCtrl'
    }).when('/textiles', {
      templateUrl: 'views/textileManager.html',
      controller: 'TextileManagerCtrl'
    }).when('/textile/new', {
      templateUrl: 'views/textile.html',
      controller: 'TextileCtrl'
    }).when('/textile/:textileId', {
      templateUrl: 'views/textile.html',
      controller: 'TextileCtrl'
    }).when('/objects', {
      templateUrl: 'views/objectManager.html',
      controller: 'ObjectManagerCtrl'
    }).when('/object/new', {
      templateUrl: 'views/object.html',
      controller: 'ObjectCtrl'
    }).when('/object/:objectId', {
      templateUrl: 'views/object.html',
      controller: 'ObjectCtrl'
    }).when('/friends', {
      templateUrl: 'views/friendManager.html',
      controller: 'FriendManagerCtrl'
    }).when('/friend/new', {
      templateUrl: 'views/friend.html',
      controller: 'FriendCtrl'
    }).when('/friend/:friendId', {
      templateUrl: 'views/friend.html',
      controller: 'FriendCtrl'
    }).when('/cv', {
      templateUrl: 'views/cv.html',
      controller: 'CvCtrl'
    }).when('/etc', {
      templateUrl: 'views/etc.html',
      controller: 'EtcCtrl'
    }).otherwise({ redirectTo: '/' });
  }
]);
app.config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
  }
]);
// var onDateChange = function(){
//   console.log('date changed!');
// };
// app.config(function(ngQuickDateDefaultsProvider) {
//   ngQuickDateDefaultsProvider.set('onChange', onDateChange);
// })
// TODO: check out these functions and possibly refactor a bit
function generateUniqueId() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : r & 7 | 8).toString(16);
    });
  return uuid;
}
;
function convertToSlug(Text) {
  return Text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  ;
}
var setPristine = function (form) {
  if (form.$setPristine) {
    //only supported from v1.1.x
    form.$setPristine();
  } else {
    /*
                 *Underscore looping form properties, you can use for loop too like:
                 *for(var i in form){ 
                 *  var input = form[i]; ...
                 */
    _.each(form, function (input) {
      if (input.$dirty) {
        input.$dirty = false;
      }
      if (input.$setDirty) {
        input.$setDirty(false);
      }
    });
  }
};
'use strict';
angular.module('cmsFrontendApp').controller('LoginCtrl', [
  '$scope',
  '$rootScope',
  '$location',
  '$modal',
  '$anchorScroll',
  'loggedInChecker',
  function ($scope, $rootScope, $location, $modal, $anchorScroll, loggedInChecker) {
    $rootScope.userLoaded = false;
    $anchorScroll();
    console.log('in the login controller');
    $rootScope.currentPage = 'login';
    function getMe() {
      loggedInChecker.validateUser();
    }
    getMe();
    $scope.showLogin = function (val) {
      $scope.loginVisible = val;
      if (val) {
        $scope.username = '';
        $scope.password = '';
      }
    };
    $scope.login = function () {
      if (!$scope.username || !$scope.password) {
        $scope.launchErrorModal();
        return;
      }
      dpd.users.login({
        username: $scope.username,
        password: $scope.password
      }, function (session, error) {
        if (error) {
          $scope.launchErrorModal();
        } else {
          location.href = '#!/dashboard';
          getMe();
        }
      });
    };
    $scope.launchErrorModal = function () {
      var fieldType = 'loginError';
      var modalInstance = $modal.open({ templateUrl: 'views/loginErrorModalTemplate.html' });
      modalInstance.result.then(function () {
        $scope.username = '';
        $scope.password = '';
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    $scope.logout = function () {
      dpd.users.logout(function () {
        $rootScope.currentUser = null;
        $scope.$apply();
        location.href = '#!/login';
      });
    };
  }
]);
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service.
var ModalInstanceCtrl = [
    '$scope',
    '$http',
    '$modalInstance',
    'modalObj',
    function ($scope, $http, $modalInstance, modalObj) {
      $scope.modalObj = modalObj;
      $scope.imageObj = {};
      $scope.imageObj.altText = $scope.modalObj.altText || '';
      $scope.submitClass = 'inactive';
      $scope.uploadFile = function (file) {
        $scope.uploading = true;
        $scope.$apply();
        console.log('the upload url is ' + $scope.modalObj.uploadUrl);
        var fd = new FormData();
        fd.append('file', file);
        var url = 'http://api.madelinemanson.com' + $scope.modalObj.uploadUrl;
        $http.post(url, fd, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        }).success(function (response) {
          // $scope.uploading = false;
          $scope.submitClass = '';
          $scope.submitEnabled = true;
          $scope.imageObj.urls = response;
          console.log('success');
          console.log('response is ' + JSON.stringify(response));
        });
      };
      $scope.dropzoneConfig = {
        'options': {
          'url': '/',
          'createImageThumbnails': false
        },
        'eventHandlers': {
          'addedfile': function (file) {
            $scope.uploadFile(file);
          },
          'success': function (file, response) {
          },
          'accept': function (file, done) {
            done('NOT DONE!');
          }
        }
      };
      $scope.ok = function () {
        $modalInstance.close($scope.imageObj);
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ];
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service.
var RemoveModalInstanceCtrl = [
    '$scope',
    '$modalInstance',
    'obj',
    'type',
    function ($scope, $modalInstance, obj, type) {
      $scope.objTitle = obj.name;
      $scope.objType = type;
      $scope.obj = obj;
      $scope.ok = function () {
        $modalInstance.close();
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ];
var EditModalInstanceCtrl = [
    '$scope',
    '$modalInstance',
    function ($scope, $modalInstance) {
      $scope.ok = function () {
        $modalInstance.close();
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ];
'use strict';
angular.module('cmsFrontendApp').controller('ThingCtrl', [
  '$scope',
  '$location',
  '$routeParams',
  '$rootScope',
  '$compile',
  '$modal',
  '$log',
  'blockInfo',
  '$anchorScroll',
  'loggedInChecker',
  function ($scope, $location, $routeParams, $rootScope, $compile, $modal, $log, blockInfo, $anchorScroll, loggedInChecker) {
    loggedInChecker.validateUser();
    $rootScope.currentPage = 'thing';
    $scope.subHeaderText = 'thing';
    $anchorScroll();
    $scope.selectedTag = undefined;
    $scope.validTags = [
      'Research',
      'Strategy',
      'Concepting',
      'Branding',
      'Photography',
      'Information Architecture',
      'Experience Design',
      'Interactive Design',
      'Visual Design',
      'Industrial Design',
      'System Architecture',
      'Front End Development',
      'Back End Development',
      'Mobile Web',
      'iOS/Android Native',
      'Hardware Prototyping',
      'Testing + Stabilization',
      'Maintenance'
    ];
    $scope.validTagsCopy = $scope.validTags.slice(0);
    $scope.tagColumn = [];
    setTagCols();
    $scope.thingId = null;
    $scope.availableBlocks = [
      {
        'name': 'Pull quote',
        'type': 'pullQuote',
        'id': '02ff9b74e90da8a0'
      },
      {
        'name': 'Video embed',
        'type': 'video',
        'id': '1d3c508b08eec8e3'
      },
      {
        'name': '2/3 Image left',
        'type': '23left',
        'id': '40736eaa1fba4b0a'
      },
      {
        'name': 'Full-bleed image',
        'type': 'fullBleed',
        'id': '61deff5184d5f80d'
      },
      {
        'name': 'Code snippet',
        'type': 'code',
        'id': '67165ff57b55ebf8'
      },
      {
        'name': 'Fullsize image',
        'type': 'image',
        'id': 'b525748a7ed128e5'
      },
      {
        'name': 'Body copy',
        'type': 'body',
        'id': 'b9134abdabd97869'
      },
      {
        'name': '2/3 Video right',
        'type': '23rightVideo',
        'id': 'bab43ae2a9f0285c'
      },
      {
        'name': '2/3 Image right',
        'type': '23right',
        'id': 'd2be0582f227c897'
      },
      {
        'name': '2/3 Video left',
        'type': '23leftVideo',
        'id': 'db1384dd300379fc'
      }
    ];
    $scope.selectVals = [
      'Option1',
      'Option2',
      'Option3',
      'Option4'
    ];
    if (!$rootScope.currentUser) {
      location.href = '#!/thing';
    } else {
      $scope.thing = {
        selectVal: {
          'id': $rootScope.currentUser.id,
          'firstName': $rootScope.currentUser.firstName,
          'lastName': $rootScope.currentUser.lastName
        },
        blocks: [],
        state: 'temp'
      };
      $scope.thing.blocks = $scope.availableBlocks;
      $scope.thing.tags = [];
      if ($routeParams.thingId) {
        $scope.thingId = $routeParams.thingId;  // Get the thing by its ID from deployd, and do all the necessary setup
      } else {
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
    $scope.thingSelectVal = { 'label': 'Select Option 1' };
    $('select').selectBoxIt({
      autoWidth: false,
      downArrowIcon: 'icon-dropdown',
      defaultText: $scope.thingSelectVal.label,
      populate: $scope.selectVals
    });
    var selectBox = $('select').data('selectBox-selectBoxIt');
    $('select').bind({
      'change': function () {
        $scope.changeSelectVal($(this).val());
      }
    });
    $scope.changeSelectVal = function (newVal) {
      $scope.thing.someValue = newVal;
    };
    // ~#~#~#~#~##~#TAG INPUT~#~##~#~##~#
    $scope.getValidTags = function () {
      $scope.typingTag = true;
      if ($scope.potentialTag === '') {
        $scope.typingTag = false;
      }
      var potentialTagChar = $scope.potentialTag.length;
      var tempTags = [];
      for (var i = 0; i < $scope.validTagsCopy.length; i++) {
        if ($scope.potentialTag.toUpperCase() === $scope.validTagsCopy[i].slice(0, potentialTagChar).toUpperCase()) {
          tempTags.push($scope.validTagsCopy[i]);
        }
      }
      $scope.validTags = tempTags;
      setTagCols();
    };
    function setTagCols() {
      var minTagsPerCol = Math.floor($scope.validTags.length / 3);
      var extraTags = $scope.validTags.length % 3;
      var colsWithMinTags = 3 - extraTags;
      var i = 0;
      while (i < colsWithMinTags) {
        $scope.tagColumn[i] = $scope.validTags.splice(0, minTagsPerCol);
        i++;
      }
      while (i < 3) {
        $scope.tagColumn[i] = $scope.validTags.splice(0, minTagsPerCol + 1);
        i++;
      }
    }
    ;
    // method to call on enter press
    $scope.setTag = function (tag) {
      console.log('called it');
      if (typeof tag === 'undefined') {
        for (var i = 0; i < 3; i++) {
          if ($scope.tagColumn[i].length > 0) {
            if ($scope.thing.tags.indexOf($scope.tagColumn[i][0]) == -1) {
              $scope.thing.tags.push($scope.tagColumn[i][0]);
              $scope.potentialTag = '';
              $scope.getValidTags();
            }
            break;
          }
        }
      } else {
        if ($scope.thing.tags.indexOf(tag) == -1) {
          $scope.thing.tags.push(tag);
        }
      }
    };
    $scope.removeTag = function (tag) {
      console.log('selected tag is ' + tag);
      var index = $scope.thing.tags.indexOf(tag);
      var numTags = $scope.thing.tags.length;
      $scope.thing.tags.splice(index, 1);
    };
    // ~~~~~~METHODS FOR BLOCKS~~~~~~~~
    $scope.addBlock = function (which) {
      var clonedBlock = JSON.parse(JSON.stringify(which));
      clonedBlock.id = clonedBlock.id + '-' + generateUniqueId();
      if (!$scope.thing.hasOwnProperty('blocks')) {
        $scope.thing.blocks = [];
      }
      $scope.thing.blocks.push(clonedBlock);
      $scope.toggleDropdown();
      return false;
    };
    $scope.removeBlock = function (which) {
      var index = $scope.thing.blocks.indexOf(which);
      $scope.thing.blocks.splice(index, 1);
    };
    // return the block name we want to display to the user
    $scope.getBlockNameFromType = function (blockType) {
      return blockInfo.getNameFromBlockType(blockType);
    };
    $scope.getIconFromBlockType = function (blockType) {
      return blockInfo.getIconFromBlockType(blockType);
    };
    $scope.toggleDropdown = function (dropdown) {
      $scope.dropdownShowing = !$scope.dropdownShowing;
    };
    $scope.scrollToBlock = function (blockId) {
      var old = $location.hash();
      $location.hash('block' + blockId);
      $anchorScroll();
      $location.hash(old);
    };
    $scope.openImageModal = function (fieldType) {
      if (fieldType.name) {
        var isBlock = true;
        var uploadUrl = blockInfo.getUrlForBlockType(fieldType.type);
      } else {
        var uploadUrl = blockInfo.getUrlForBlockType(fieldType);
      }
      uploadUrl = uploadUrl + $scope.thing.id;
      var modalInstance = $modal.open({
          templateUrl: 'views/imageModalTemplate.html',
          controller: ModalInstanceCtrl,
          resolve: {
            fieldType: function () {
              if (isBlock) {
                return fieldType.type;
              }
              return fieldType;
            },
            uploadUrl: function () {
              return uploadUrl;
            },
            currentPage: function () {
              return 'blog';
            }
          }
        });
      modalInstance.result.then(function (imageObj) {
        if (fieldType === 'Blog Teaser Image') {
          $scope.thing.teaserImage = imageObj.urls;
        } else if (fieldType === 'Hero Parallax Image') {
          $scope.thing.heroImage = imageObj.urls;
        } else if (isBlock) {
          fieldType.imageUrl = imageObj.urls;
          fieldType.alt = imageObj.altText;
        }
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    $scope.shouldDisplayThumb = function (field) {
      if (!$scope.thing) {
        return false;
      }
      if (field === 'Blog Teaser Image') {
        if ($scope.thing.teaserImage) {
          if ($scope.thing.teaserImage.mdpi) {
            return true;
          }
        }
        return false;
      }
      if (field === 'Hero Parallax Image') {
        if ($scope.thing.heroImage) {
          if ($scope.thing.heroImage.mdpi) {
            return true;
          }
        }
        return false;
      }
      return false;
    };
    $scope.imageThumbnail = function (field) {
      if ($scope.shouldDisplayThumb(field)) {
        if (field === 'Blog Teaser Image') {
          var urlObj = $scope.thing.teaserImage;
        } else if (field === 'Hero Parallax Image') {
          var urlObj = $scope.thing.heroImage;
        }
        return { backgroundImage: 'url(' + urlObj.mdpi + ')' };
      }
      return '';
    };
    $scope.blockShouldDisplayThumb = function (block) {
      if (block.imageUrl) {
        if (block.imageUrl.mdpi) {
          return true;
        }
      }
      return false;
    };
    $scope.blockImageThumbnail = function (block) {
      if ($scope.blockShouldDisplayThumb(block)) {
        return { backgroundImage: 'url(' + block.imageUrl.mdpi + ')' };
      }
    };
    // ~!@#@!~#!~#SUBMITTING THE THING~~@!#~@#@#$!@#$@
    $scope.formIsValid = function () {
      // return false under invalid conditions and true when valid
      if ($scope.thing) {
        return true;
      }
      return false;
    };
    $scope.save = function (thing) {
      if (this.thingForm.$invalid) {
        console.log('INVALID');
        return false;
      }
      $scope.thing.lastSaved = new Date().getTime();
      if ($scope.thing.state == 'temp')
        $scope.thing.state = 'draft';
      if (!$scope.thing.datePublished)
        $scope.thing.slug = convertToSlug($scope.thing.title);
      if ($scope.thingId) {
        $scope.remapSelectVal();  // put the thing to dpd and change lastSaved time in controller
      }
    };
    $scope.publish = function (thing) {
      if (this.blogForm.$invalid)
        return false;
      if (!$scope.thing.datePublished)
        $scope.thing.datePublished = new Date().getTime();
      if (!$scope.thing.slug) {
        $scope.thing.slug = convertToSlug($scope.thing.title);
      }
      $scope.thing.state = 'published';
      if ($scope.thingId) {
        //validate blocks
        $scope.remapSelectVal();  // put the thing to dpd and redirect to #!/thing
      }
    };
    $scope.unpublish = function (thing) {
      $scope.thing.state = 'draft';
      $scope.save();
      $scope.startAutoSave();
    };
    $scope.startAutoSave = function () {
      $scope.autoSaveTimer = setTimeout(function () {
        $scope.autoSave();
      }, 10000);
    };
    $scope.autoSave = function () {
      if ($location.$$path == '/blog/' + $scope.thingId) {
        if ($scope.blogForm.$dirty && $scope.formIsValid()) {
          $scope.save();
        }
        $scope.startAutoSave();
      }
    };
    $scope.stopAutoSave = function () {
      clearTimeout($scope.autoSaveTimer);
    };
    $scope.stopAutoSave();
    $scope.back = function () {
      $scope.stopAutoSave();
      $location.path('/blog').replace();
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').controller('ThingManagerCtrl', [
  '$scope',
  '$location',
  '$routeParams',
  '$rootScope',
  '$modal',
  'loggedInChecker',
  'listSorting',
  'modalManager',
  function ($scope, $location, $routeParams, $rootScope, $modal, loggedInChecker, listSorting, modalManager) {
    loggedInChecker.validateUser();
    $rootScope.currentPage = 'thing';
    $scope.go = function (thing) {
      location.href = '#!/thing/' + thing.id;
    };
    $scope.sortBy = function (property) {
      if (property === 'title') {
        if ($scope.sortedByTitleAZ) {
          $scope.feed.things = listSorting.sortBy('titleZA', $scope.feed.things);
          $scope.sortedByTitleZA = true;
          $scope.sortedByTitleAZ = false;
        } else {
          $scope.feed.things = listSorting.sortBy('titleAZ', $scope.feed.things);
          $scope.sortedByTitleAZ = true;
          $scope.sortedByTitleZA = false;
        }
      }
    };
    $scope.remove = function (thing) {
      $scope.feed.things = _.without($scope.feed.things, thing);  // thing.state = "deleted";
                                                                  // dpd.things.put(thing, function (err) {
                                                                  // 	if(err) console.log(err);
                                                                  // });
    };
    $scope.openRemoveModal = function (thing) {
      modalManager.removalModal(thing, $scope.remove);
    };
    var PAGE_SIZE = 15;
    var ThingFeeder = function ThingFeeder(query) {
      this.query = query || {};
      this.things = [];
      this.moreToLoad = true;
    };
    ThingFeeder.prototype.loadContents = function () {
      var feed = this;
      if (feed.moreToLoad) {
        this.moreToLoad = false;
        var query = angular.copy(this.query);
        query.$limit = PAGE_SIZE;
        if (feed.things) {
          query.$skip = feed.things.length;
        }
        query.$sort = { lastSaved: -1 };
        query.state = {
          $in: [
            'draft',
            'published'
          ]
        };
        query.$fields = {
          title: 1,
          datePublished: 1,
          author: 1,
          state: 1
        };
        // Remove this after retrieving real content. This is just dummy data
        var date1 = new Date();
        var date2 = new Date('05/19/1956');
        var date3 = new Date('05/10/1960');
        feed.things = [
          {
            'title': 'Thing 1',
            'property1': 'Green',
            'property2': 'Squiggly',
            'state': 'published',
            'date': date1,
            'id': 1
          },
          {
            'title': 'Thing 2',
            'property1': 'Yellow',
            'property2': 'Scratchy',
            'state': 'published',
            'date': date2,
            'id': 2
          },
          {
            'title': 'Thing 3',
            'property1': 'Orange',
            'property2': 'Bumpy',
            'state': 'published',
            'date': date3,
            'id': 3
          }
        ];  // dpd.things.get(query, function(result) {
            // 	if (result.length >= PAGE_SIZE) {
            // 		// result.pop();
            // 		feed.moreToLoad = true;
            // 	} else {
            // 		feed.moreToLoad = false;
            // 	}
            // 	Array.prototype.push.apply(feed.things, result);
            // 	$scope.things = feed.things;
            // 	if($scope.sortedByTitleAZ){
            // 		$scope.feed.things = listSorting.sortBy('titleAZ', $scope.feed.things);
            // 	}
            // 	else if($scope.sortedByTitleZA){
            // 		$scope.feed.things = listSorting.sortBy('titleZA', $scope.feed.things);
            // 	}
            // 	$scope.$apply();
            // });
      }
    };
    var feed = new ThingFeeder();
    $scope.feed = feed;
  }
]);
'use strict';
angular.module('cmsFrontendApp').controller('PrintCtrl', [
  '$scope',
  '$rootScope',
  'loggedInChecker',
  '$anchorScroll',
  '$routeParams',
  'modalManager',
  function ($scope, $rootScope, loggedInChecker, $anchorScroll, $routeParams, modalManager) {
    loggedInChecker.validateUser();
    $rootScope.currentPage = 'prints';
    $anchorScroll();
    $scope.printId = null;
    if ($routeParams.printId) {
      $scope.printId = $routeParams.printId;
      dpd.prints.get($scope.printId, function (result, error) {
        if (error) {
          console.log('there was an error: ');
          console.log(error);
        } else {
          console.log(result);
          $scope.print = result;
          $scope.subHeaderText = result.state === 'temp' ? 'print-new' : 'print';
          $scope.$apply();
        }
      });
    } else {
      $scope.print = {
        'state': 'temp',
        'createdBy': $rootScope.currentUser.id
      };
      dpd.prints.post($scope.print, function (result, error) {
        if (error) {
          console.log('there was an error');
          console.log(error);
        } else {
          location.href = '#!/print/' + result.id;
        }
      });
    }
    $scope.back = function () {
      location.href = '#!/prints';
    };
    $scope.formIsValid = function () {
      if ($scope.print) {
        if ($scope.print.name && $scope.print.image) {
          return true;
        }
      }
      return false;
    };
    $scope.updatePrint = function () {
      if ($scope.printId) {
        dpd.prints.put($scope.print, function (result, error) {
          if (error) {
            console.log('there was an error: ');
            console.log(error);
            $scope.serverError = error;
          } else {
            location.href = '#!/prints';
          }
        });
      }
    };
    function setWeightingToLeast() {
      var query = {
          $sort: { weighting: 1 },
          id: { $ne: $scope.printId },
          state: 'published'
        };
      dpd.prints.get(query, function (results) {
        if (results && results.length > 0 && results[0].weighting) {
          var minWeight = results[0].weighting;
          $scope.print.weighting = minWeight - 1;
        } else {
          $scope.print.weighting = 20;
        }
        $scope.updatePrint();
      });
    }
    ;
    $scope.save = function () {
      if (!$scope.formIsValid()) {
        $scope.invalidSubmitted = true;
        return false;
      }
      $scope.print.state = 'published';
      $scope.print.slug = convertToSlug($scope.print.name);
      if (!$scope.print.weighting) {
        setWeightingToLeast();
      } else {
        $scope.updatePrint();
      }
    };
    // ~%~%~%~%~%~%~%Modal%~%~%~%~%~~%~
    $scope.openImageModal = function (imageName) {
      var modalObj = {};
      modalObj.hasAltText = true;
      modalObj.altText = $scope.print.imageAltText;
      modalObj.icon = 'icon-img';
      modalObj.templateUrl = '';
      modalObj.spec = 'at least px x px';
      modalObj.title = 'Print Image';
      modalObj.info = 'Image of the print to appear in vertical scroll view.';
      modalObj.uploadUrl = '/resize-portfolio-image/' + $scope.print.id + '/image';
      modalManager.imageModal(modalObj).then(function (imageObj) {
        $scope.print.image = imageObj.urls;
        $scope.print.imageAltText = imageObj.altText;
      });
    };
    $scope.imageThumbnail = function (imageName) {
      if ($scope.print) {
        var urlObj = $scope.print[imageName];
        if (urlObj) {
          return { backgroundImage: 'url(' + urlObj.xhdpi + ')' };
        }
      }
      return '';
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').controller('PrintManagerCtrl', [
  '$scope',
  '$rootScope',
  '$location',
  'loggedInChecker',
  'modalManager',
  'weightUpdater',
  function ($scope, $rootScope, $location, loggedInChecker, modalManager, weightUpdater) {
    loggedInChecker.validateUser();
    $rootScope.currentPage = 'prints';
    var PAGE_SIZE = 10;
    var PrintFeeder = function PrintFeeder(query) {
      this.query = query || {};
      this.prints = [];
      this.moreToLoad = true;
    };
    PrintFeeder.prototype.loadContents = function () {
      var feed = this;
      if (feed.moreToLoad) {
        this.moreToLoad = false;
        var query = angular.copy(this.query);
        query.$limit = PAGE_SIZE;
        if (feed.prints) {
          query.$skip = feed.prints.length;
        }
        query.$limit = PAGE_SIZE;
        query.$sort = { weighting: -1 };
        query.state = 'published';
        query.$fields = {
          name: 1,
          image: 1,
          dateCreated: 1,
          weighting: 1
        };
        dpd.prints.get(query, function (result) {
          if (result.length >= PAGE_SIZE) {
            // result.pop();
            feed.moreToLoad = true;
          } else {
            feed.moreToLoad = false;
          }
          Array.prototype.push.apply(feed.prints, result);
          $scope.prints = feed.prints;
          $scope.feed = feed;
          $scope.$apply();
        });
      }
    };
    var feed = new PrintFeeder();
    // feed.loadContents();
    $scope.feed = feed;
    $scope.sortingOptions = weightUpdater.sortingOptions($scope.feed.prints, 'prints', $scope);
    $scope.openRemoveModal = function (print) {
      modalManager.removalModal(print, 'print').then(function () {
        $scope.feed.prints = _.without($scope.feed.prints, print);
        print.state = 'deleted';
        dpd.prints.put(print, function (err) {
          if (err)
            console.log(err);
        });
      });
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').controller('TextileCtrl', [
  '$scope',
  '$rootScope',
  'loggedInChecker',
  '$anchorScroll',
  '$routeParams',
  'modalManager',
  '$location',
  function ($scope, $rootScope, loggedInChecker, $anchorScroll, $routeParams, modalManager, $location) {
    loggedInChecker.validateUser();
    $rootScope.currentPage = 'textiles';
    $anchorScroll();
    $scope.textileId = null;
    $scope.availableBlocks = [{
        'name': 'Fullsize Image',
        'type': 'image',
        'id': '02ff9b74e90da8a0'
      }];
    if ($routeParams.textileId) {
      $scope.textileId = $routeParams.textileId;
      dpd.textiles.get($scope.textileId, function (result, error) {
        if (error) {
          console.log('there was an error: ');
          console.log(error);
        } else {
          console.log(result);
          $scope.textile = result;
          $scope.subHeaderText = result.state === 'temp' ? 'textile-new' : 'textile';
          $scope.$apply();
        }
      });
    } else {
      $scope.textile = {
        'state': 'temp',
        'createdBy': $rootScope.currentUser.id
      };
      dpd.textiles.post($scope.textile, function (result, error) {
        if (error) {
          console.log('there was an error');
          console.log(error);
        } else {
          location.href = '#!/textile/' + result.id;
        }
      });
    }
    $scope.back = function () {
      location.href = '#!/textiles';
    };
    $scope.formIsValid = function () {
      if ($scope.textile) {
        if ($scope.textile.name) {
          console.log('returning valid form');
          return true;
        }
      }
      return false;
    };
    $scope.updateTextile = function () {
      if ($scope.textileId) {
        console.log($scope.textile);
        // $scope.textile.images = [];
        // var testblock = {};
        // testblock.name = "Fullsize Image";
        // $scope.textile.images.push(testblock);
        dpd.textiles.put($scope.textile, function (result, error) {
          if (error) {
            console.log('there was an error: ');
            console.log(error);
            $scope.serverError = error;
          } else {
            console.log('updated the textile!');
            location.href = '#!/textiles';
          }
        });
      }
    };
    function setWeightingToLeast() {
      var query = {
          $sort: { weighting: 1 },
          id: { $ne: $scope.textileId },
          state: 'published'
        };
      dpd.textiles.get(query, function (results) {
        if (results && results.length > 0 && results[0].weighting) {
          var minWeight = results[0].weighting;
          $scope.textile.weighting = minWeight - 1;
        } else {
          console.log('updating the weight');
          $scope.textile.weighting = 20;
        }
        $scope.updateTextile();
      });
    }
    ;
    $scope.save = function () {
      if (!$scope.formIsValid()) {
        $scope.invalidSubmitted = true;
        return false;
      }
      $scope.textile.state = 'published';
      $scope.textile.slug = convertToSlug($scope.textile.name);
      if (!$scope.textile.weighting) {
        setWeightingToLeast();
      } else {
        $scope.updateTextile();
      }
    };
    // ~%~%~%~%~%~%~%Modal%~%~%~%~%~~%~
    $scope.openImageModal = function (block) {
      var modalObj = {};
      modalObj.hasAltText = true;
      modalObj.altText = $scope.textile.imageAltText;
      modalObj.icon = 'icon-img';
      modalObj.templateUrl = '';
      modalObj.spec = 'at least px x px';
      modalObj.title = 'Textile Image';
      modalObj.info = 'Image of the textile to appear in vertical scroll view.';
      modalObj.uploadUrl = '/resize-portfolio-image/' + $scope.textile.id + '/image';
      modalManager.imageModal(modalObj).then(function (imageObj) {
        block.image = imageObj.urls;
        block.imageAltText = imageObj.altText;
      });
    };
    $scope.blockImageThumbnail = function (block) {
      if ($scope.textile) {
        var urlObj = block.image;
        if (urlObj) {
          return { backgroundImage: 'url(' + urlObj['carousel-xhdpi'] + ')' };
        }
      }
      return '';
    };
    //!#!#!#!##!#!image blocks!@!@!@@!!@!@!@
    $scope.scrollToBlock = function (blockId) {
      var old = $location.hash();
      $location.hash('block' + blockId);
      $anchorScroll();
      $location.hash(old);
    };
    $scope.toggleDropdown = function (dropdown) {
      $scope.dropdownShowing = !$scope.dropdownShowing;
    };
    $scope.addBlock = function () {
      var clonedBlock = {};
      clonedBlock.id = generateUniqueId();
      clonedBlock.name = 'Fullsize Image';
      if (!$scope.textile.hasOwnProperty('images')) {
        $scope.textile.images = [];
      }
      $scope.textile.images.push(clonedBlock);
      $scope.toggleDropdown();
      return false;
    };
    $scope.removeBlock = function (which) {
      var index = $scope.textile.images.indexOf(which);
      $scope.textile.images.splice(index, 1);
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').controller('TextileManagerCtrl', [
  '$scope',
  '$rootScope',
  '$location',
  'loggedInChecker',
  'modalManager',
  'weightUpdater',
  function ($scope, $rootScope, $location, loggedInChecker, modalManager, weightUpdater) {
    loggedInChecker.validateUser();
    $rootScope.currentPage = 'textiles';
    var PAGE_SIZE = 10;
    var TextileFeeder = function TextileFeeder(query) {
      this.query = query || {};
      this.textiles = [];
      this.moreToLoad = true;
    };
    TextileFeeder.prototype.loadContents = function () {
      var feed = this;
      if (feed.moreToLoad) {
        this.moreToLoad = false;
        var query = angular.copy(this.query);
        query.$limit = PAGE_SIZE;
        if (feed.textiles) {
          query.$skip = feed.textiles.length;
        }
        query.$limit = PAGE_SIZE;
        query.$sort = { weighting: -1 };
        query.state = 'published';
        query.$fields = {
          name: 1,
          thumbnail: 1,
          dateCreated: 1,
          weighting: 1
        };
        dpd.textiles.get(query, function (result) {
          if (result.length >= PAGE_SIZE) {
            // result.pop();
            feed.moreToLoad = true;
          } else {
            feed.moreToLoad = false;
          }
          Array.prototype.push.apply(feed.textiles, result);
          $scope.textiles = feed.textiles;
          $scope.feed = feed;
          $scope.$apply();
        });
      }
    };
    var feed = new TextileFeeder();
    // feed.loadContents();
    $scope.feed = feed;
    $scope.sortingOptions = weightUpdater.sortingOptions($scope.feed.textiles, 'textiles', $scope);
    $scope.openRemoveModal = function (textile) {
      modalManager.removalModal(textile, 'textile').then(function () {
        $scope.feed.textiles = _.without($scope.feed.textiles, textile);
        textile.state = 'deleted';
        dpd.textiles.put(textile, function (err) {
          if (err)
            console.log(err);
        });
      });
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').controller('ObjectCtrl', [
  '$scope',
  '$rootScope',
  'loggedInChecker',
  '$anchorScroll',
  '$routeParams',
  'modalManager',
  '$location',
  function ($scope, $rootScope, loggedInChecker, $anchorScroll, $routeParams, modalManager, $location) {
    loggedInChecker.validateUser();
    $rootScope.currentPage = 'objects';
    $anchorScroll();
    $scope.objectId = null;
    $scope.availableBlocks = [{
        'name': 'Fullsize Image',
        'type': 'image',
        'id': '02ff9b74e90da8a0'
      }];
    if ($routeParams.objectId) {
      $scope.objectId = $routeParams.objectId;
      dpd.objects.get($scope.objectId, function (result, error) {
        if (error) {
          console.log('there was an error: ');
          console.log(error);
        } else {
          console.log(result);
          $scope.object = result;
          $scope.subHeaderText = result.state === 'temp' ? 'object-new' : 'object';
          $scope.$apply();
        }
      });
    } else {
      $scope.object = {
        'state': 'temp',
        'createdBy': $rootScope.currentUser.id
      };
      dpd.objects.post($scope.object, function (result, error) {
        if (error) {
          console.log('there was an error');
          console.log(error);
        } else {
          location.href = '#!/object/' + result.id;
        }
      });
    }
    $scope.back = function () {
      location.href = '#!/objects';
    };
    $scope.formIsValid = function () {
      if ($scope.object) {
        if ($scope.object.name && $scope.object.image) {
          return true;
        }
      }
      return false;
    };
    $scope.updateObject = function () {
      if ($scope.objectId) {
        dpd.objects.put($scope.object, function (result, error) {
          if (error) {
            console.log('there was an error: ');
            console.log(error);
            $scope.serverError = error;
          } else {
            location.href = '#!/objects';
          }
        });
      }
    };
    function setWeightingToLeast() {
      var query = {
          $sort: { weighting: 1 },
          id: { $ne: $scope.objectId },
          state: 'published'
        };
      dpd.objects.get(query, function (results) {
        if (results && results.length > 0 && results[0].weighting) {
          var minWeight = results[0].weighting;
          $scope.object.weighting = minWeight - 1;
        } else {
          $scope.object.weighting = 20;
        }
        $scope.updateObject();
      });
    }
    ;
    $scope.save = function () {
      if (!$scope.formIsValid()) {
        $scope.invalidSubmitted = true;
        return false;
      }
      $scope.object.state = 'published';
      $scope.object.slug = convertToSlug($scope.object.name);
      if (!$scope.object.weighting) {
        setWeightingToLeast();
      } else {
        $scope.updateObject();
      }
    };
    // ~%~%~%~%~%~%~%Modal%~%~%~%~%~~%~
    $scope.openImageModal = function (imageName) {
      var modalObj = {};
      modalObj.hasAltText = true;
      modalObj.altText = $scope.object.imageAltText;
      modalObj.icon = 'icon-img';
      modalObj.templateUrl = '';
      modalObj.spec = 'at least px x px';
      modalObj.title = 'Object Image';
      modalObj.info = 'Image of the object to appear in vertical scroll view.';
      modalObj.uploadUrl = '/resize-portfolio-image/' + $scope.object.id + '/image';
      modalManager.imageModal(modalObj).then(function (imageObj) {
        $scope.object.image = imageObj.urls;
        $scope.object.imageAltText = imageObj.altText;
      });
    };
    $scope.imageThumbnail = function (imageName) {
      if ($scope.object) {
        var urlObj = $scope.object[imageName];
        if (urlObj) {
          return { backgroundImage: 'url(' + urlObj.xhdpi + ')' };
        }
      }
      return '';
    };
    //!#!#!#!##!#!image blocks!@!@!@@!!@!@!@
    $scope.scrollToBlock = function (blockId) {
      var old = $location.hash();
      $location.hash('block' + blockId);
      $anchorScroll();
      $location.hash(old);
    };
    $scope.toggleDropdown = function (dropdown) {
      $scope.dropdownShowing = !$scope.dropdownShowing;
    };
    $scope.addBlock = function (which) {
      var clonedBlock = JSON.parse(JSON.stringify(which));
      clonedBlock.id = clonedBlock.id + '-' + generateUniqueId();
      if (!$scope.object.hasOwnProperty('images')) {
        $scope.object.images = [];
      }
      $scope.object.images.push(clonedBlock);
      $scope.toggleDropdown();
      return false;
    };
    $scope.removeBlock = function (which) {
      var index = $scope.object.images.indexOf(which);
      $scope.object.images.splice(index, 1);
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').controller('ObjectManagerCtrl', [
  '$scope',
  '$rootScope',
  '$location',
  'loggedInChecker',
  'modalManager',
  'weightUpdater',
  function ($scope, $rootScope, $location, loggedInChecker, modalManager, weightUpdater) {
    loggedInChecker.validateUser();
    $rootScope.currentPage = 'objects';
    var PAGE_SIZE = 10;
    var ObjectFeeder = function ObjectFeeder(query) {
      this.query = query || {};
      this.objects = [];
      this.moreToLoad = true;
    };
    ObjectFeeder.prototype.loadContents = function () {
      var feed = this;
      if (feed.moreToLoad) {
        this.moreToLoad = false;
        var query = angular.copy(this.query);
        query.$limit = PAGE_SIZE;
        if (feed.objects) {
          query.$skip = feed.objects.length;
        }
        query.$limit = PAGE_SIZE;
        query.$sort = { weighting: -1 };
        query.state = 'published';
        query.$fields = {
          name: 1,
          thumbnail: 1,
          dateCreated: 1,
          weighting: 1
        };
        dpd.objects.get(query, function (result) {
          if (result.length >= PAGE_SIZE) {
            // result.pop();
            feed.moreToLoad = true;
          } else {
            feed.moreToLoad = false;
          }
          Array.prototype.push.apply(feed.objects, result);
          $scope.objects = feed.objects;
          $scope.feed = feed;
          $scope.$apply();
        });
      }
    };
    var feed = new ObjectFeeder();
    // feed.loadContents();
    $scope.feed = feed;
    $scope.sortingOptions = weightUpdater.sortingOptions($scope.feed.objects, 'objects', $scope);
    $scope.openRemoveModal = function (object) {
      modalManager.removalModal(object, 'object').then(function () {
        $scope.feed.objects = _.without($scope.feed.objects, object);
        object.state = 'deleted';
        dpd.objects.put(object, function (err) {
          if (err)
            console.log(err);
        });
      });
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').controller('FriendCtrl', [
  '$scope',
  '$rootScope',
  'loggedInChecker',
  '$anchorScroll',
  '$routeParams',
  'modalManager',
  '$location',
  function ($scope, $rootScope, loggedInChecker, $anchorScroll, $routeParams, modalManager, $location) {
    loggedInChecker.validateUser();
    $rootScope.currentPage = 'friends';
    $anchorScroll();
    $scope.friendId = null;
    if ($routeParams.friendId) {
      $scope.friendId = $routeParams.friendId;
      dpd.friends.get($scope.friendId, function (result, error) {
        if (error) {
          console.log('there was an error: ');
          console.log(error);
        } else {
          console.log(result);
          $scope.friend = result;
          $scope.subHeaderText = result.state === 'temp' ? 'friend-new' : 'friend';
          $scope.$apply();
        }
      });
    } else {
      $scope.friend = {
        'state': 'temp',
        'createdBy': $rootScope.currentUser.id
      };
      dpd.friends.post($scope.friend, function (result, error) {
        if (error) {
          console.log('there was an error');
          console.log(error);
        } else {
          location.href = '#!/friend/' + result.id;
        }
      });
    }
    $scope.back = function () {
      location.href = '#!/friends';
    };
    $scope.formIsValid = function () {
      if ($scope.friend) {
        if ($scope.friend.name && $scope.friend.url) {
          return true;
        }
      }
      return false;
    };
    $scope.updateFriend = function () {
      if ($scope.friendId) {
        dpd.friends.put($scope.friend, function (result, error) {
          if (error) {
            console.log('there was an error: ');
            console.log(error);
            $scope.serverError = error;
          } else {
            location.href = '#!/friends';
          }
        });
      }
    };
    function setWeightingToLeast() {
      var query = {
          $sort: { weighting: 1 },
          id: { $ne: $scope.friendId },
          state: 'published'
        };
      dpd.friends.get(query, function (results) {
        if (results && results.length > 0 && results[0].weighting) {
          var minWeight = results[0].weighting;
          $scope.friend.weighting = minWeight - 1;
        } else {
          $scope.friend.weighting = 20;
        }
        $scope.updateFriend();
      });
    }
    ;
    $scope.save = function () {
      if (!$scope.formIsValid()) {
        $scope.invalidSubmitted = true;
        return false;
      }
      $scope.friend.state = 'published';
      $scope.friend.slug = convertToSlug($scope.friend.name);
      if (!$scope.friend.weighting) {
        setWeightingToLeast();
      } else {
        $scope.updateFriend();
      }
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').controller('FriendManagerCtrl', [
  '$scope',
  '$rootScope',
  '$location',
  'loggedInChecker',
  'modalManager',
  'weightUpdater',
  function ($scope, $rootScope, $location, loggedInChecker, modalManager, weightUpdater) {
    loggedInChecker.validateUser();
    $rootScope.currentPage = 'friends';
    var PAGE_SIZE = 15;
    var FriendFeeder = function FriendFeeder(query) {
      this.query = query || {};
      this.friends = [];
      this.moreToLoad = true;
    };
    FriendFeeder.prototype.loadContents = function () {
      var feed = this;
      if (feed.moreToLoad) {
        this.moreToLoad = false;
        var query = angular.copy(this.query);
        query.$limit = PAGE_SIZE;
        if (feed.friends) {
          query.$skip = feed.friends.length;
        }
        query.$limit = PAGE_SIZE;
        query.$sort = { weighting: -1 };
        query.state = 'published';
        query.$fields = {
          name: 1,
          url: 1,
          dateCreated: 1,
          weighting: 1
        };
        dpd.friends.get(query, function (result) {
          if (result.length >= PAGE_SIZE) {
            // result.pop();
            feed.moreToLoad = true;
          } else {
            feed.moreToLoad = false;
          }
          Array.prototype.push.apply(feed.friends, result);
          $scope.friends = feed.friends;
          $scope.feed = feed;
          $scope.$apply();
        });
      }
    };
    var feed = new FriendFeeder();
    // feed.loadContents();
    $scope.feed = feed;
    $scope.sortingOptions = weightUpdater.sortingOptions($scope.feed.friends, 'friends', $scope);
    $scope.openRemoveModal = function (friend) {
      modalManager.removalModal(friend, 'friend').then(function () {
        $scope.feed.friends = _.without($scope.feed.friends, friend);
        friend.state = 'deleted';
        dpd.friends.put(friend, function (err) {
          if (err)
            console.log(err);
        });
      });
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').controller('CvCtrl', [
  '$scope',
  '$rootScope',
  'loggedInChecker',
  'modalManager',
  function ($scope, $rootScope, loggedInChecker, modalManager) {
    loggedInChecker.validateUser();
    $rootScope.currentPage = 'cv';
    $scope.subHeaderText = 'cv';
    dpd.cv.get(function (result, error) {
      if (error) {
        console.log('there was an error: ');
        console.log(error);
      } else {
        $scope.cv = result[0];
        // console.log($scope.cv);
        $scope.$apply();
        $scope.cv.slug = 'cv';
      }
    });
    $scope.formIsValid = function () {
      if ($scope.cv && $scope.cv.content) {
        return true;
      }
      return false;
    };
    $scope.save = function () {
      $scope.validSubmitted = false;
      if (!$scope.formIsValid()) {
        $scope.invalidSubmitted = true;
        return false;
      }
      dpd.cv.put($scope.cv, function (result, error) {
        if (error) {
          console.log('there was an error: ');
          console.log(error);
          $scope.serverError = error;
        } else {
          $scope.cv = result;
          $scope.cv.slug = 'cv';
          $scope.validSubmitted = true;
          $scope.$apply();
        }
      });
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').controller('EtcCtrl', [
  '$scope',
  '$rootScope',
  'loggedInChecker',
  'modalManager',
  function ($scope, $rootScope, loggedInChecker, modalManager) {
    loggedInChecker.validateUser();
    $rootScope.currentPage = 'etc';
    $scope.subHeaderText = 'etc';
    dpd.etc.get(function (result, error) {
      if (error) {
        console.log('there was an error: ');
        console.log(error);
      } else {
        $scope.etc = result[0];
        // console.log($scope.etc);
        $scope.$apply();
        $scope.etc.slug = 'etc';
      }
    });
    $scope.formIsValid = function () {
      if ($scope.etc && $scope.etc.homeImage && $scope.etc.aboutImage && $scope.etc.friendsImage) {
        return true;
      }
      return false;
    };
    $scope.save = function () {
      $scope.validSubmitted = false;
      if (!$scope.formIsValid()) {
        $scope.invalidSubmitted = true;
        return false;
      }
      dpd.etc.put($scope.etc, function (result, error) {
        if (error) {
          console.log('there was an error: ');
          console.log(error);
          $scope.serverError = error;
        } else {
          $scope.etc = result;
          $scope.etc.slug = 'etc';
          $scope.validSubmitted = true;
          $scope.$apply();
        }
      });
    };
    // ~%~%~%~%~%~%~%Modal%~%~%~%~%~~%~
    $scope.openImageModal = function (imageName) {
      var modalObj = {};
      modalObj.hasAltText = true;
      modalObj.altText = $scope.etc[imageName + 'altText'];
      modalObj.icon = 'icon-img';
      modalObj.templateUrl = '';
      if (imageName === 'homeImage') {
        modalObj.title = 'Home Page Image';
        modalObj.info = 'Large image shown on the home page.';
        modalObj.uploadUrl = '/resize-poster-frame/' + $scope.etc.id;
        modalObj.spec = 'at least 1152px x 550px';
      } else if (imageName === 'aboutImage') {
        modalObj.title = 'About Page Image';
        modalObj.info = 'Image shown on the about page.';
        modalObj.uploadUrl = '/resize-poster-frame/' + $scope.etc.id;
        modalObj.spec = 'at least 1152px x 550px';
      } else {
        modalObj.title = 'Friends Page Image';
        modalObj.info = 'Image shown on the friends page.';
        modalObj.uploadUrl = '/resize-poster-frame/' + $scope.etc.id;
        modalObj.spec = 'at least 1152px x 550px';
      }
      modalManager.imageModal(modalObj).then(function (imageObj) {
        $scope.etc[imageName] = imageObj.urls;
        $scope.etc[imageName + 'altText'] = imageObj.altText;
      });
    };
    $scope.imageThumbnail = function (imageName) {
      if ($scope.etc) {
        var urlObj = $scope.etc[imageName];
        if (urlObj) {
          return { backgroundImage: 'url(' + urlObj.xhdpi + ')' };
        }
      }
      return '';
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').directive('subHeader', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      currentPage: '@',
      currentObject: '=currentObj',
      publish: '&publishFcn',
      unpublish: '&unpublishFcn',
      save: '&saveFcn',
      back: '&',
      isValid: '&formIsValid'
    },
    controller: [
      '$scope',
      function ($scope) {
      }
    ],
    templateUrl: 'views/subHeaderTemplate.html'
  };
});
'use strict';
angular.module('cmsFrontendApp').directive('subHeaderSimple', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    controller: [
      '$scope',
      function ($scope) {
      }
    ],
    templateUrl: 'views/subHeaderSimpleTemplate.html'
  };
});
'use strict';
angular.module('cmsFrontendApp').directive('inputWithCharacterBackground', function () {
  return {
    restrict: 'A',
    templateUrl: '/views/inputWithCharacterBackgroundTemplate.html',
    scope: {
      ngModel: '=',
      inputName: '@',
      icon: '@'
    },
    controller: [
      '$scope',
      '$element',
      '$attrs',
      function ($scope, $element, $attrs) {
        $scope.toggleFocus = function () {
          $scope.inputFocus = !$scope.inputFocus;
        };
      }
    ],
    link: function postLink(scope, element, attrs) {
      scope.$watch('inputFocus', function (isFocused) {
        var color = '';
        if (isFocused) {
          color = '#f26a21';
        } else {
          color = '#a6a6a6';
        }
        element.css('border-color', color);
        element.children('.background-icon').css('color', color);
      });
    }
  };
});
'use strict';
angular.module('cmsFrontendApp').directive('dropzone', function () {
  return {
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
      var config = scope.dropzoneConfig;
      // create a Dropzone for the element with the given options
      var dropzone = new Dropzone(element[0], config.options);
      // bind the given event handlers
      _.each(config.eventHandlers, function (handler, event) {
        dropzone.on(event, handler);
      });
    }
  };
});
'use strict';
angular.module('cmsFrontendApp').service('$fileUpload', [
  '$http',
  function ($http) {
    this.uploadFile = function (file) {
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').service('loggedInChecker', [
  '$rootScope',
  function ($rootScope) {
    $rootScope.userLoaded = false;
    this.validateUser = function () {
      dpd.users.me(function (user) {
        if (!user) {
          location.href = '#!/login';
        } else {
          $rootScope.currentUser = user;
          $rootScope.userLoaded = true;
          $rootScope.$apply();  // console.log('user is loaded');
                                // $scope.avatarUrl = 'url(' + user.avatarUrl + ')';
        }
      });
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').service('listSorting', function listSorting() {
  // AngularJS will instantiate a singleton by calling "new" on this function
  this.sortAZ = function (a, b) {
    if (a.title.toUpperCase() < b.title.toUpperCase())
      return -1;
    if (a.title.toUpperCase() > b.title.toUpperCase())
      return 1;
    return 0;
  }, this.sortZA = function (a, b) {
    if (a.title.toUpperCase() > b.title.toUpperCase())
      return -1;
    if (a.title.toUpperCase() < b.title.toUpperCase())
      return 1;
    return 0;
  }, this.sortBy = function (property, items) {
    if (property === 'titleZA') {
      items.sort(this.sortZA);
    } else {
      items.sort(this.sortAZ);
    }
    return items;
  };
});
'use strict';
angular.module('cmsFrontendApp').service('modalManager', [
  '$modal',
  function modalManager($modal) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.imageModal = function (modalObj) {
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
    }, this.removalModal = function (item, type) {
      var modalInstance = $modal.open({
          templateUrl: 'views/removeModalTemplate.html',
          controller: RemoveModalInstanceCtrl,
          resolve: {
            obj: function () {
              return item;
            },
            type: function () {
              return type;
            }
          }
        });
      var promise = modalInstance.result.then(function () {
          return;
        });
      return promise;
    }, this.editModal = function () {
      var modalInstance = $modal.open({
          templateUrl: 'views/editModalTemplate.html',
          controller: EditModalInstanceCtrl
        });
      var promise = modalInstance.result.then(function () {
          return;
        });
      return promise;
    };
    this.archiveBeerModal = function (beer, archiving) {
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
      var promise = modalInstance.result.then(function (beerObj) {
          return beerObj;
        });
      return promise;
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').directive('ucsSelectBox', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        ngModel: '=',
        selectId: '@',
        defaultText: '@',
        selectOptions: '=',
        selectClass: '@'
      },
      template: '<select class="{{selectClass}}" id="{{selectId}}"></select>',
      link: function postLink(scope, element, attrs) {
        var idString = 'select#' + scope.selectId;
        $timeout(function () {
          $(idString).selectBoxIt({
            autoWidth: false,
            downArrowIcon: 'icon-dropdown',
            defaultText: scope.defaultText,
            populate: scope.selectOptions
          });
          $(idString).bind({
            'change': function () {
              scope.ngModel = $(this).val();
              scope.$apply();
            }
          });
        });
        scope.$watch('defaultText', function (newVal) {
          var selectBox = $(idString).data('selectBox-selectBoxIt');
          if (selectBox)
            selectBox.setOption('defaultText', newVal);
        });
      }
    };
  }
]);
'use strict';
angular.module('cmsFrontendApp').service('weightUpdater', function Weightupdater() {
  var maxWeight = 20;
  var updateWeights = this.updateWeights = function (objects, objType, scope) {
      for (var i = 0; i < objects.length; i++) {
        if (objects[i].status && objects[i].status === 'brewing now') {
        } else {
          objects[i].weighting = maxWeight - i;
          dpd[objType].put(objects[i], function (result, error) {
            if (error) {
              console.log('an error occurred updating weights');
            }
          });
        }
      }
      if (!scope.$$phase) {
        scope.$apply();
      }
    };
  this.sortingOptions = function (objects, objType, scope, disableSelector) {
    var sortableItems = disableSelector || '> *';
    var options = {
        scroll: false,
        items: sortableItems,
        stop: function (event, ui) {
          updateWeights(objects, objType, scope);
        },
        helper: function (event, ui) {
          var $originals = ui.children();
          var $helper = ui.clone();
          $helper.children().each(function (index) {
            // Set helper cell sizes to match the original sizes
            $(this).width($originals.eq(index).width());
          });
          return $helper;
        }
      };
    return options;
  };
});
'use strict';
angular.module('cmsFrontendApp').service('blockInfo', function () {
  // AngularJS will instantiate a singleton by calling "new" on this function
  this.getNameFromBlockType = function (type) {
    var newName = '';
    switch (type) {
    case '23right':
      newName = 'Image Right';
      break;
    case '23left':
      newName = 'Image Left';
      break;
    case 'fullBleed':
      newName = 'Image Break';
      break;
    case 'pullQuote':
      newName = 'Pull Quote';
      break;
    case '23rightVideo':
      newName = 'Embed Video Right';
      break;
    case '23leftVideo':
      newName = 'Embed Video Left';
      break;
    // blog post blocks
    case 'body':
      newName = 'Body Copy';
      break;
    case 'image':
      newName = 'Full Size Image';
      break;
    case 'code':
      newName = 'Code Snippet';
      break;
    case 'video':
      newName = 'Embed Video';
      break;
    case 'Teaser Image':
      newName = 'Teaser Image';
      break;
    case 'Lead Photo':
      newName = 'Lead Photo';
      break;
    case 'Blog Teaser Image':
      newName = 'Blog Teaser';
      break;
    case 'Hero Parallax Image':
      newName = 'Hero Parallax';
      break;
    case 'Avatar BW':
      newName = 'Avatar (B&W)';
      break;
    case 'Avatar Color':
      newName = 'Avatar (Color)';
      break;
    }
    return newName;
  }, this.getIconFromBlockType = function (type) {
    var iconName = '';
    switch (type) {
    case '23right':
      iconName = 'icon-contentRight';
      break;
    case '23left':
      iconName = 'icon-contentLeft';
      break;
    case 'fullBleed':
      iconName = 'icon-imgBreak';
      break;
    case 'pullQuote':
      iconName = 'icon-pullquote';
      break;
    case '23rightVideo':
      iconName = 'icon-videoRight';
      break;
    case '23leftVideo':
      iconName = 'icon-videoLeft';
      break;
    // blog post blocks
    case 'body':
      iconName = 'icon-text';
      break;
    case 'image':
      iconName = 'icon-img';
      break;
    case 'code':
      iconName = 'icon-code';
      break;
    case 'video':
      iconName = 'icon-video';
      break;
    case 'Teaser Image':
      iconName = 'icon-projectTeaser';
      break;
    case 'Lead Photo':
      iconName = 'icon-contentLead';
      break;
    case 'Blog Teaser Image':
      iconName = 'icon-blogTeaser';
      break;
    case 'Hero Parallax Image':
      iconName = 'icon-imgHero';
      break;
    case 'Avatar BW':
      iconName = 'icon-profile';
      break;
    case 'Avatar Color':
      iconName = 'icon-profile';
      break;
    }
    return iconName;
  }, this.getSpecsForBlockType = function (type) {
    var specString = '';
    switch (type) {
    case 'Teaser Image':
      specString = 'At Least 1158px x 760px';
      break;
    case 'Lead Photo':
      specString = 'At Least 1920px x 1260px';
      break;
    case '23right':
      specString = 'At Least 1920px x 1260px';
      break;
    case '23left':
      specString = 'At Least 1920px x 1260px';
      break;
    case 'fullBleed':
      specString = 'At Least 3360px x 1120px';
      break;
    case 'image':
      specString = 'At Least 1920px x 1260px';
      break;
    case 'Blog Teaser Image':
      specString = 'At Least 800px x 800px';
      break;
    case 'Hero Parallax Image':
      specString = 'At Least 3360 px WIDE, variable height';
      break;
    case 'Avatar BW':
      specString = 'At Least 600 px x 600px';
      break;
    case 'Avatar Color':
      specString = 'At Least 600 px x 600px';
      break;
    }
    return specString;
  };
  this.getInfoForBlockType = function (type) {
    var description = '';
    switch (type) {
    case 'Teaser Image':
      description = 'Appears in the All Projects grid';
      break;
    case 'Lead Photo':
      description = 'Appears at the top of the project page';
      break;
    case '23right':
      description = 'Standard project image left with text right';
      break;
    case '23left':
      description = 'Standard project image right with text left';
      break;
    case 'fullBleed':
      description = 'Full width compositional image break';
      break;
    case 'image':
      description = 'Appears inline within the blog post';
      break;
    case 'Blog Teaser Image':
      description = 'Appears in a circular crop on the blog page';
      break;
    case 'Hero Parallax Image':
      description = 'Fills area above post with scroll effect';
      break;
    case 'Avatar BW':
      description = 'Appears on US grid, profile page, & blog posts';
      break;
    case 'Avatar Color':
      description = 'Appears on hover over black & white avatar on US page';
      break;
    }
    return description;
  };
  this.getUrlForBlockType = function (type) {
    var url = '';
    switch (type) {
    case 'Teaser Image':
      url = '/resize-workteaser/';
      break;
    case 'Lead Photo':
      url = '/resize-lead/';
      break;
    case '23right':
      url = '/resize-contentimage/';
      break;
    case '23left':
      url = '/resize-contentimage/';
      break;
    case 'fullBleed':
      url = '/resize-imagebreak/';
      break;
    case 'image':
      url = '/resize-fullsize/';
      break;
    case 'Blog Teaser Image':
      url = '/resize-blogteaser/';
      break;
    case 'Hero Parallax Image':
      url = '/resize-hero/';
      break;
    case 'Avatar BW':
      url = '/resize-avatar/';
      break;
    case 'Avatar Color':
      url = '/resize-avatar/';
      break;
    }
    return url;
  };
  this.getAltTextBoolean = function (type) {
    var hasAltText = true;
    switch (type) {
    case 'Blog Teaser Image':
      hasAltText = false;
      break;
    case 'Hero Parallax Image':
      hasAltText = false;
      break;
    case 'Teaser Image':
      hasAltText = false;
      break;
    case 'Lead Photo':
      hasAltText = false;
      break;
    case 'Avatar BW':
      hasAltText = false;
      break;
    case 'Avatar Color':
      hasAltText = false;
      break;
    }
    return hasAltText;
  };
});
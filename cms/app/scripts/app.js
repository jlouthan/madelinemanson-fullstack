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

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/prints'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/prints', {
        templateUrl: 'views/printManager.html',
        controller: 'PrintManagerCtrl'
      })
      .when('/print/new', {
        templateUrl: 'views/print.html',
        controller: 'PrintCtrl'
      })
      .when('/print/:printId', {
        templateUrl: 'views/print.html',
        controller: 'PrintCtrl'
      })
      .when('/textiles', {
        templateUrl: 'views/textileManager.html',
        controller: 'TextileManagerCtrl'
      })
      .when('/textile/new', {
        templateUrl: 'views/textile.html',
        controller: 'TextileCtrl'
      })
      .when('/textile/:textileId', {
        templateUrl: 'views/textile.html',
        controller: 'TextileCtrl'
      })
      .when('/objects', {
        templateUrl: 'views/objectManager.html',
        controller: 'ObjectManagerCtrl'
      })
      .when('/object/new', {
        templateUrl: 'views/object.html',
        controller: 'ObjectCtrl'
      })
      .when('/object/:objectId', {
        templateUrl: 'views/object.html',
        controller: 'ObjectCtrl'
      })
      .when('/books', {
        templateUrl: 'views/bookManager.html',
        controller: 'BookManagerCtrl'
      })
      .when('/book/new', {
        templateUrl: 'views/book.html',
        controller: 'BookCtrl'
      })
      .when('/book/:bookId', {
        templateUrl: 'views/book.html',
        controller: 'BookCtrl'
      })
      .when('/friends', {
        templateUrl: 'views/friendManager.html',
        controller: 'FriendManagerCtrl'
      })
      .when('/friend/new', {
        templateUrl: 'views/friend.html',
        controller: 'FriendCtrl'
      })
      .when('/friend/:friendId', {
        templateUrl: 'views/friend.html',
        controller: 'FriendCtrl'
      })
      .when('/cv', {
        templateUrl: 'views/cv.html',
        controller: 'CvCtrl'
      })
      .when('/etc', {
        templateUrl: 'views/etc.html',
        controller: 'EtcCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
}]);

// var onDateChange = function(){
//   console.log('date changed!');
// };

// app.config(function(ngQuickDateDefaultsProvider) {
//   ngQuickDateDefaultsProvider.set('onChange', onDateChange);
// })


// TODO: check out these functions and possibly refactor a bit
function generateUniqueId() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};
function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
}

var setPristine = function(form){
            if(form.$setPristine){//only supported from v1.1.x
                form.$setPristine();
            }else{

                /*
                 *Underscore looping form properties, you can use for loop too like:
                 *for(var i in form){ 
                 *  var input = form[i]; ...
                 */
                _.each(form, function (input)
                {
                    if (input.$dirty) {
                        input.$dirty = false;
                    }
                    if(input.$setDirty){
                        input.$setDirty(false);
                    }
                });
            }
        };

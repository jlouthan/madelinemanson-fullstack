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
        redirectTo: '/thing'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/things', {
        templateUrl: 'views/thingManager.html',
        controller: 'ThingManagerCtrl'
      })
      .when('/thing/new', {
        templateUrl: 'views/thing.html',
        controller: 'ThingCtrl'
      })
      .when('/thing/:thingId', {
        templateUrl: 'views/thing.html',
        controller: 'ThingCtrl'
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
      .otherwise({
        redirectTo: '/things'
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

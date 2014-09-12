'use strict';

describe('Controller: CocktailmanagerCtrl', function () {

  // load the controller's module
  beforeEach(module('cmsFrontendApp'));

  var CocktailmanagerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CocktailmanagerCtrl = $controller('CocktailmanagerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

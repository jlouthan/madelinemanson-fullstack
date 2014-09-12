'use strict';

describe('Controller: MenuitemCtrl', function () {

  // load the controller's module
  beforeEach(module('cmsFrontendApp'));

  var MenuitemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenuitemCtrl = $controller('MenuitemCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

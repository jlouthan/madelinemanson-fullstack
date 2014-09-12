'use strict';

describe('Controller: MenuitemmanagerCtrl', function () {

  // load the controller's module
  beforeEach(module('cmsFrontendApp'));

  var MenuitemmanagerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenuitemmanagerCtrl = $controller('MenuitemmanagerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

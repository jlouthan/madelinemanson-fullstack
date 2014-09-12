'use strict';

describe('Controller: BeermanagerCtrl', function () {

  // load the controller's module
  beforeEach(module('cmsFrontendApp'));

  var BeermanagerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BeermanagerCtrl = $controller('BeermanagerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

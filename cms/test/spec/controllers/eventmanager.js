'use strict';

describe('Controller: EventmanagerCtrl', function () {

  // load the controller's module
  beforeEach(module('cmsFrontendApp'));

  var EventmanagerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventmanagerCtrl = $controller('EventmanagerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Directive: selectBox', function () {

  // load the directive's module
  beforeEach(module('cmsFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<select-box></select-box>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the selectBox directive');
  }));
});

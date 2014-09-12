'use strict';

describe('Service: Weightupdater', function () {

  // load the service's module
  beforeEach(module('cmsFrontendApp'));

  // instantiate service
  var Weightupdater;
  beforeEach(inject(function (_Weightupdater_) {
    Weightupdater = _Weightupdater_;
  }));

  it('should do something', function () {
    expect(!!Weightupdater).toBe(true);
  });

});

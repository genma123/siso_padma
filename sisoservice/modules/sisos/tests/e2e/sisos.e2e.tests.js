'use strict';

describe('Sisos E2E Tests:', function () {
  describe('Test Sisos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sisos');
      expect(element.all(by.repeater('siso in sisos')).count()).toEqual(0);
    });
  });
});

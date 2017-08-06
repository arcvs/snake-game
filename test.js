var { assert } = require('chai');

require('../game.js');

describe('pip', function() {
  it('should return -1 when the value is not present', function() {
    assert.equal(pip(1,9),10);
  });
});

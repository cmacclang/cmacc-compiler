const path = require('path');
const assert = require('assert');
const cmacc = require('../../src/index');

describe('simple_variable', function () {


  it('parse', function () {
    const file = path.join('file://', __dirname, './simple_variable.cmacc')
    const res = cmacc.parse(file);
    const expect = {
      world: {
        '$$str$$': 'world',
        '$$obj$$': this
      },
      '$$text$$': '# Hello {{world}}',
      '$$file$$': file
    }
    assert.equal(res, expect);
  });
});
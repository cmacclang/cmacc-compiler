const assert = require('assert');

const variables = require('../../src/index').variables;

describe('compiler', () => {

  const text = `$ world = "world"
# Hello {{world}}`;

  it('simple', () => {

    const vars = [
      "world = null",
      "world = \"\"",
      "world = \"world\"",
      "world = world",
      "world = [./world]",
      "world = [http://example.nl/test.cmacc]",
    ];

    const res = variables(vars)

    assert.equal(res[0].type, 'null');
    assert.equal(res[1].type, 'string');
    assert.equal(res[2].type, 'string');
    assert.equal(res[3].type, 'variable');
    assert.equal(res[4].type, 'cmacc');
    assert.equal(res[5].type, 'cmacc');

    assert.equal(res[0].value, null);
    assert.equal(res[1].value, "");
    assert.equal(res[2].value, "world");
    assert.equal(res[3].value, "world");
    assert.equal(res[4].value, './world');
    assert.equal(res[5].value, 'http://example.nl/test.cmacc');


  });

});
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
      "world = {}",
      "world = {\"test\" : \"test\"}",
      "world = world",
      "world = [./world]",
      "world = [http://example.nl/test.cmacc]",
    ];

    const res = variables(vars)

    assert.equal(res[0].type, 'null');
    assert.equal(res[1].type, 'string');
    assert.equal(res[2].type, 'string');
    assert.equal(res[3].type, 'object');
    assert.equal(res[4].type, 'object');
    assert.equal(res[5].type, 'variable');
    assert.equal(res[6].type, 'link');
    assert.equal(res[7].type, 'link');

    assert.equal(res[0].value, null);
    assert.equal(res[1].value, "");
    assert.equal(res[2].value, "world");
    assert.equal(res[3].value, "{}");
    assert.equal(res[4].value, "{\"test\" : \"test\"}");
    assert.equal(res[5].value, "world");
    assert.equal(res[6].value, './world');
    assert.equal(res[7].value, 'http://example.nl/test.cmacc');


  });

});
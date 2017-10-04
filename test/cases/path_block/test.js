const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('bind_simple', function () {

  global.fs = require('fs');

  it('Index', function () {
    const file = url.join('file://', __dirname, './Index.cmacc')
    return cmacc.compile(file)
      .then(ast => {
        assert.deepEqual(ast['$path'], []);

        assert.deepEqual(ast.block['$path'], ['block']);
        return ast;
      });

  });

});
const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('path_block_in_block', function () {

  global.fs = require('fs');

  it('Index', function () {
    const file = url.join('file://', __dirname, './Index.cmacc')
    return cmacc.compile(file)
      .then(ast => {
        assert.deepEqual(ast['$path'], []);

        assert.deepEqual(ast.block1['$path'], ['block1']);

        assert.deepEqual(ast.block1.block2['$path'], ['block1','block2']);
        return ast;
      });

  });

});
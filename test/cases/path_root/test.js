const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('path_root', function () {

  global.fs = require('fs');

  it('Index', function () {
    const file = url.join('file://', __dirname, './Index.cmacc')
    return cmacc.compile(file)
      .then(ast => {
        assert.deepEqual(ast['$path'], []);
        return ast;
      });

  });

});
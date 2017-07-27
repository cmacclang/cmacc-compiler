const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('json_simple', function () {

  global.fs = require('fs');

  it('happy', function (done) {
    const file = url.join('file://', __dirname, './index.cmacc')
    cmacc.compile(file)
      .then(ast => {
        // console.log(ast)
        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = '<h1>Hello Willem Veelenturf</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });
});
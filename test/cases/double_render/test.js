const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('double_render', function () {

  global.fs = require('fs');

  it('Index', function (done) {
    const file = url.join('file://', __dirname, './Index.cmacc')
    cmacc.compile(file)
      .then(ast => {
        assert.equal(ast.contract.world, "Jan Jansen");
        return ast;
      })
      .then(ast => {
        cmacc.render(ast)
        return cmacc.render(ast)
      })
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = '<h1>Hello Jan Jansen</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });


});
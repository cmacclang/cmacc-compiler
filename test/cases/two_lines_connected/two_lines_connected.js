const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('two_lines_connected', function () {

  global.fs = require('fs');

  it('render', function (done) {
    const file = url.join('file://', __dirname, './two_lines_connected.cmacc')
    cmacc.compile(file)
      .then(ast => {
        return ast
      })
      .then(cmacc.render)
      .then(md => {
        return cmacc.remarkable.render(md)
      })
      .then(html => {
        const expect = '<p>Hello world 123\nGood bye world 123</p>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);


  });
});
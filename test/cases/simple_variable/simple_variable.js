const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('simple_variable', function () {

  global.fs = require('fs');

  it('render', function (done) {
    const file = url.join('file://', __dirname, './simple_variable.cmacc')
    cmacc.compile(file)
      .then(cmacc.render)
      .then(md => {
        return cmacc.remarkable.render(md)
      })
      .then(html => {
        const expect = '<h1>Hello world 123</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);


  });
});
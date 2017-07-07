const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('simple_link', function () {

  global.fs = require('fs');

  it('render', function (done) {
    const file = url.join('file://', __dirname, './simple_link.cmacc')
    cmacc.compile(file)
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.renderer.render(x)
      })
      .then(html => {
        const expect = '<h1>Hello world</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);
  });

});
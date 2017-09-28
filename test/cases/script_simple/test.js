const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('script_simple', function () {

  global.fs = require('fs');

  it('index', function (done) {
    const file = url.join('file://', __dirname, './index.cmacc')
    cmacc.compile(file)
      .then(x => {
        assert.equal(x.script(), 'Hello World');
        return x;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = '<h1>Hello world</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });
});
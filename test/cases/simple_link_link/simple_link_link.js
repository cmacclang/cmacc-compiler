const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('simple_link_link', function () {

  global.fs = require('fs');

  it('render', function (done) {
    const file = url.join('file://', __dirname, './simple_link_link.cmacc')
    cmacc.compile(file).then(console.log);
    cmacc.compile(file).then(cmacc.render).then(html => {
      const expect = '<h1>Hello TEST</h1>\n';
      assert.equal(html, expect);
      done();
    });
  });

});
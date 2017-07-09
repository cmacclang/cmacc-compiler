const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('simple_link_link', function () {

  global.fs = require('fs');

  it('render', function (done) {
    const file = url.join('file://', __dirname, './simple_link_link.cmacc')
    cmacc.compile(file)
      .then(cmacc.render)
      .then( x => {
        assert.equal(x[0].type, 'heading_open');
        assert.equal(x[1].type, 'inline');
        assert.equal(x[1].children[0].type, 'text');
        assert.equal(x[1].children[0].content, 'Hello TEST');
        assert.equal(x[2].type, 'heading_close');
        console.log(x)
        return x;
      })
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = '<h1>Hello TEST</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);
  });

});
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
        // console.log('----', x)
        assert.equal(x[1].type, 'variable_open');
        assert.equal(x[2].type, 'variable_open');
        assert.equal(x[3].type, 'heading_open');
        assert.equal(x[4].children[0].type, 'text');
        assert.equal(x[4].children[0].content, 'Hello ');
        assert.equal(x[4].children[1].type, 'variable_open');
        assert.equal(x[4].children[2].type, 'htmlblock');
        assert.equal(x[4].children[2].content, 'TEST');
        assert.equal(x[5].type, 'heading_close');
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
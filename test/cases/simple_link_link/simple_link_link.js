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
        assert.equal(x[0].type, 'placeholder_block_open');
        assert.deepEqual(x[0].path, ['link']);
        assert.equal(x[1].type, 'placeholder_block_open');
        assert.deepEqual(x[1].path, ['link', 'link' ]);
        assert.equal(x[2].type, 'heading_open');
        assert.equal(x[3].type, 'inline');
        assert.equal(x[3].children[0].type, 'text');
        assert.equal(x[3].children[0].content, 'Hello ');
        assert.equal(x[3].children[1].type, 'placeholder_inline_open');
        assert.deepEqual(x[3].children[1].path, ['link', 'link', 'world']);
        assert.equal(x[3].children[2].type, 'htmlblock');
        assert.equal(x[3].children[2].content, 'TEST');
        assert.equal(x[3].children[3].type, 'placeholder_inline_close');
        assert.equal(x[4].type, 'heading_close');
        assert.equal(x[5].type, 'placeholder_block_close');
        assert.equal(x[6].type, 'placeholder_block_close');
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
const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

const Remarkable = require('remarkable');
const md = new Remarkable();

describe('github', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  it('Test1', function (done) {
    const file = "https://raw.githubusercontent.com/cmacclang/cmacc-example-mortgage/master/doc/index.cmacc"
    cmacc.compile(file)
      .then(ast => {
        //console.log(ast);

        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return md.renderer.render(x)
      })
      .then(html => {
        const expect = '<h1>Hello Willem Veelenturf</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });



});
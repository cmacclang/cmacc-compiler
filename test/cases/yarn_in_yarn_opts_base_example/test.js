const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

const Remarkable = require('remarkable');
const md = new Remarkable();

describe('github', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  it('Test1', function (done) {
    const file = `$ helloworld = [yarn://cmacc-example-helloworld/Example.cmacc]

$ link = [./Link.cmacc]

{{helloworld}}

{{link}}`;

    const opts = {
      base: 'file://' + __dirname + '/'
    };

    cmacc.compile(file, opts)
      .then(ast => {
        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return md.renderer.render(x)
      })
      .then(html => {
        const expect = '<h1>World Hello</h1>\n<h1>World Hello</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });



});
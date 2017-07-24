const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

const Remarkable = require('remarkable');
const md = new Remarkable();

describe('helpers_definition', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  it('Test1', function (done) {
    const file = url.join('file://', __dirname, './Example.cmacc');

    cmacc.compile(file)
      .then(ast => {
        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = '<p><strong>Hello World</strong>  <br>\nThis is the definition of hello world</p>\n<a href="#Hello-World">Hello World</a>';
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });

});
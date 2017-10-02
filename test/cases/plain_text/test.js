const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('plain_text', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  it('test', function (done) {
    const file = url.join('file://', __dirname, './Example.cmacc');

    const input = `$ helloworld = [./HelloWorld.cmacc]

{{helloworld}}
`;
    const opts = {
      base: "file://" + __dirname + '/'
    }
    cmacc.compile(input, opts)
      .then(ast => {
        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = '<h1>Hello World</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });

});
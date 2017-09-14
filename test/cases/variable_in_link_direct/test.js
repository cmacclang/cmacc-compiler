const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('variable_in_link_direct', function () {

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
        const expect = `<p>Hello my name is Willem Veelenturf</p>
`;
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });

});
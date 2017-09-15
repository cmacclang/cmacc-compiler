const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('variable_in_mask_set_string', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  xit('Test1', function (done) {
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
        const expect = `<p>Hello full name Willem Veelenturf</p>
`;
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });

});
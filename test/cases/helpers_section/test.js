const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('helpers_definition', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  it('HelloWordSection', function (done) {
    const file = url.join('file://', __dirname, './HelloWordSection.cmacc');

    cmacc.compile(file)
      .then(ast => {
        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = `<h1>Section 1</h1>
        <h2>Sub Section 1.1</h2>
        <h3>Sub Sub Section 1.1.1</h3>
        <h2>Sub Section 1.2</h2>
        <h1>Section 2</h1>
        <h2>Sub Section 2.1</h2>
        <h3>Sub Sub Section 2.1.1</h3>
        <h1>Section 3</h1>
        <h4>Sub Sub Sub Section 3.0.0.1</h4>
        <h4>Sub Sub Sub Section 3.0.0.2</h4>`;

        assert.equal(html.replace(/\s/g, ''), expect.replace(/\s/g, ''));
        done();
      })
      .catch(done);

  });

});
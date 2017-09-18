const path = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

const testName = path.basename(__dirname);
describe(testName, function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  it('Test1', function (done) {
    const file = path.join('file://', __dirname, './Example.cmacc');

    cmacc.compile(file)
      .then(ast => {
        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = `<h1>Section 1.</h1>
<h2>Section 1.1.</h2>
<h2>Section 1.2.</h2>
`;
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });

});
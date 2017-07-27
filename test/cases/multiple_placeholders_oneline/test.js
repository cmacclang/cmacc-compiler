const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');


describe('multiple_placeholders_oneline', function () {

  global.fs = require('fs');

  it('happy', function (done) {
    const file = url.join('file://', __dirname, './Index.cmacc')
    cmacc.compile(file)

      .then(cmacc.render)
      .then(x => {
        // console.log(x)
        return x;
      })
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = `<h1>Test Hello World</h1>\n`
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });

});
const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');


describe('multiple_placeholders_list', function () {

  global.fs = require('fs');

  xit('happy', function (done) {
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
        const expect = `<ol>
          <li>Hello</li>
          <li>Test</li>
          <li>Hello World</li>
        </ol>`;

        assert.equal(html.replace(/\s/g, ''), expect.replace(/\s/g, ''));
        done();
      })
      .catch(done);

  });

});
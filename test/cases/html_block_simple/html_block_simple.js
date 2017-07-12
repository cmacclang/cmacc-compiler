const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('html_block', function () {

  global.fs = require('fs');

  it('happy', function (done) {
    const file = url.join('file://', __dirname, './Index.cmacc')
    cmacc.compile(file)
      .then(ast => {
        console.log(ast)

        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = "<table>\n    <tr>\n        <td>Willem</td>\n        <td>Veelenturf</td>\n    </tr>\n</table>";
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });
});
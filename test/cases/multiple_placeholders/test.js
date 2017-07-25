const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');


describe('multiple_placeholders', function () {

  global.fs = require('fs');

  it('happy', function (done) {
    const file = url.join('file://', __dirname, './index.cmacc')
    cmacc.compile(file)

      .then(cmacc.render)
      .then(x => {
        console.log(x)

        return x;
      })
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = `<h3>Xnum. Confidentiality</h3>
<p>Xnum.1</p>
<p>Definition</p>
<p>As used herein, the &quot;Confidential Information&quot; shall mean any and all technical and non-technical information disclosed</p>
disclose_Type<p>including without limitation information regarding</p>
<ol>
<li><p>patent and patent applications</p></li>
<li><p>trade secrets</p></li>
<li>conf_Infos</li>
<li><p>information the Disclosing Party provides regarding third parties</p></li>
<li><p>all other information that the Receiving Party knew, or reasonably should have known, was the Confidential Information of the_Disclosing Party</p></li>
</ol>
`;
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });

  it('error', function (done) {
    const file = url.join('file://', __dirname, './Error.cmacc')
    cmacc.compile(file)

      .then(cmacc.render)
      .then(x => {
        console.log(x)

        return x;
      })
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .catch(e => {
        assert.equal(e.message, 'Cannot render ref inline for param: define_Confid');
        done()
      });

  });
});
const assert = require('assert');
const path = require('path');

const fsMock = require('fs-mock');

const cmacc = require('../../src/index');


describe('render', () => {

  function fileMock(file, text) {
    var data = {};
    data[path.resolve(__dirname, '../../', file)] = text;
    global.fs = new fsMock(data);
  }

  it('link', (done) => {

    const base = 'file:\/\/:' + path.resolve(__dirname, '../../');

    const opts = {base};

    const cmacc1 = `$ world = "world1"
    
$ link = [./test.cmacc]

# Hello {{world}}

{{link}}

## Test`;

    const cmacc2 = `$ world = "world2"
    
# Hello {{world}}

Dit is een berichtje`;

    fileMock("./test.cmacc", cmacc2)

    cmacc.compile(cmacc1, opts)
      .then(cmacc.render)
      .then(md => {
        assert.equal(md[0].type, 'heading_open');
        assert.equal(md[1].type, 'inline');
        assert.equal(md[2].type, 'heading_close');
        done();
      })
      .catch(done);
    ;

  });

});
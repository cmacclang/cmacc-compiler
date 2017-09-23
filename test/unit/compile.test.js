const assert = require('assert');
const path = require('path');

const cmacc = require('../../src/index');

describe('compiler', () => {


  it('simple', (done) => {

    const text = `$ world = "world"
    
# Hello {{world}}`;

    cmacc.compile(text)
      .then((ast) => {
        assert.equal(ast['$md'][0].type, 'heading_open');
        assert.equal(ast['$md'][1].content, 'Hello {{world}}');
        assert.equal(ast['$md'][2].type, 'heading_close');
        done();
      })
      .catch(done);

  });


});
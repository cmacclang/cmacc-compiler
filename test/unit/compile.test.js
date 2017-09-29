const assert = require('assert');
const path = require('path');

const cmacc = require('../../src/index');

describe('compiler', () => {


  it('simple', (done) => {

    const text = `$ world = "world"
    
# Hello {{world}}`;

    cmacc.compile(text)
      .then((ast) => {
        assert.equal(ast['$md'][1].type, 'heading_open');
        assert.equal(ast['$md'][2].type, 'inline');
        assert.equal(ast['$md'][2].content, 'Hello {{world}}');
        assert.equal(ast['$md'][2].children[0].type, 'text');
        assert.equal(ast['$md'][2].children[0].content, 'Hello ');
        assert.equal(ast['$md'][2].children[1].type, 'placeholder_inline');
        assert.equal(ast['$md'][2].children[1].content, '{{world}}');
        assert.equal(ast['$md'][2].children[1].variable, 'world');
        assert.equal(ast['$md'][3].type, 'heading_close');
        done();
      })
      .catch(done);

  });


  it('simple', (done) => {

    const text = `$ world = "world"
    
# Hello {{#test 'test'}}`;

    cmacc.compile(text)
      .then((ast) => {
        assert.equal(ast['$md'][1].type, 'heading_open');
        assert.equal(ast['$md'][2].type, 'inline');
        assert.equal(ast['$md'][2].content, 'Hello {{#test \'test\'}}');
        assert.equal(ast['$md'][2].children[0].type, 'text');
        assert.equal(ast['$md'][2].children[0].content, 'Hello ');
        assert.equal(ast['$md'][2].children[1].type, 'placeholder_inline');
        assert.equal(ast['$md'][2].children[1].content, '{{#test \'test\'}}');
        assert.equal(ast['$md'][2].children[1].variable, '#test \'test\'');
        assert.equal(ast['$md'][3].type, 'heading_close');
        done();
      })
      .catch(done);

  });


});
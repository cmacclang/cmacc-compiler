const assert = require('assert');
const path = require('path');

const fsMock = require('fs-mock');
const fetchMock = require('fetch-mock');

const compiler = require('../../src/index').compile;
const reduce = require('../../src/index').reduce;
const render = require('../../src/index').render;

describe('compiler', () => {


  it('simple', (done) => {

    const text = `$ world = "world"
    
# Hello {{world}}`;

    compiler(text).then((ast) => {
      assert.equal(ast['$md$'][0].type, 'heading_open');
      assert.equal(ast['$md$'][1].content, 'Hello {{world}}');
      assert.equal(ast['$md$'][2].type, 'heading_close');
      done();
    });

  });




});
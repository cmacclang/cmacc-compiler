const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

const Remarkable = require('remarkable');
const md = new Remarkable();

describe('schema_overwrite', function () {

  global.fs = require('fs');

  it('index', function (done) {
    const file = url.join('file://', __dirname, './index.cmacc')
    cmacc.compile(file)
      .then(ast => {
        //console.log(ast)

        return ast;
      })
      .then(cmacc.validate)
      .then(cmacc.render)
      .then(x => {
        return md.renderer.render(x)
      })
      .catch(e =>{
        assert.equal(e.message, 'requires property "lastName"');
        done()
      });

  });
});
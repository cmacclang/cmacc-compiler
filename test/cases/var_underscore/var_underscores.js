const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('var_underscore', function () {

  global.fs = require('fs');

  it('UsingTheLibraryOfClauses', function (done) {
    const file = url.join('file://', __dirname, './UsingTheLibraryOfClauses.cmacc')
    cmacc.compile(file)
      .then(ast => {
        assert.equal('This agreement is for the whole world', ast['territory_Definition']['territory_Global']);
        assert.equal('This agreement is for the US territory only', ast['agreement_Territory']);
        return ast;
      })
      .then(cmacc.render)
      .then(md => {
        return cmacc.remarkable.render(md)
      })
      .then(html => {
        const expect = 'This agreement is for the US territory only';
        assert.equal(html, expect);
        done();
      })
      .catch(done);


  });

  it('UsingTheLibraryOfClauses2', function (done) {
    const file = url.join('file://', __dirname, './UsingTheLibraryOfClauses2.cmacc')
    cmacc.compile(file)
      .then(cmacc.render)
      .then(md => {
        return cmacc.remarkable.render(md)
      })
      .then(html => {
        const expect = 'This agreement is for the US territory only';
        assert.equal(html, expect);
        done();
      })
      .catch(done);


  });
});
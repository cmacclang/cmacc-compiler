const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('bind_simple', function () {

  global.fs = require('fs');

  it('Test1', function (done) {
    const file = url.join('file://', __dirname, './Test1.cmacc')
    cmacc.compile(file)
      .then(ast => {
        //console.log(ast);

        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = '<h1>Hello Willem Veelenturf</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });

  it('Test2', function (done) {
    const file = url.join('file://', __dirname, './Test2.cmacc')
    cmacc.compile(file)
      .then(ast => {
        //console.log(ast);

        //ast.test.person = ast.person

        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = '<h1>Hello Jan Jansen</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });

  it('Test3', function (done) {
    const file = url.join('file://', __dirname, './Test3.cmacc')
    cmacc.compile(file)
      .then(ast => {
        ast.test.person = ast.person
        ast.test.test.person = ast.test.person
        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = '<h1>Hello Joop de Vries</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });

});
const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('helpers_section_dynamic', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  it('DynamicNum', function () {
    const file = url.join('file://', __dirname, './DynamicNum.cmacc');

    return cmacc.compile(file)
      .then(ast => {
        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = `<h1>Hello x</h1>
        <h1>Hello x.x.x</h1>
        <h1>1 Test</h1>
        <h2>1.0.1 Test</h2>
        <h2>1.0.2 Test</h2>
        <h2>1.0.3 Test</h2>`;

        assert.equal(html.replace(/\s/g, ''), expect.replace(/\s/g, ''));

      })


  });

  it('DynamicNumOverwrite', function () {
    const file = url.join('file://', __dirname, './DynamicNumOverwrite.cmacc');

    return cmacc.compile(file)
      .then(ast => {


        assert.equal(ast.xNum, "x.x");
        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = `<h1>Hello x.x</h1>
        <h1>Hello x.x.x.x</h1>
        <h1>0.1 Test</h1>
        <h2>0.1.0.1 Test</h2>
        <h2>0.1.0.2 Test</h2>
        <h2>0.1.0.3 Test</h2>`;

        assert.equal(html.replace(/\s/g, ''), expect.replace(/\s/g, ''));

      })


  });

});
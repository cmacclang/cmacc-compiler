const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('schema_simple', function () {

  global.fs = require('fs');

  it('index', function (done) {
    const file = url.join('file://', __dirname, './index.cmacc')
    cmacc.compile(file)
      .then(ast => {
        // console.log(ast)
        assert.equal(ast.person['$schema'].id, "http://example.com/example.json");
        assert.deepEqual(ast.person['$schema'].properties.firstName, {
          "id": "/properties/firstName",
          "type": "string"
        });
        assert.deepEqual(ast.person['$schema'].properties.lastName, {
          "id": "/properties/lastName",
          "type": "string"
        });
        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = '<h1>Hello world</h1>\n';
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });
});
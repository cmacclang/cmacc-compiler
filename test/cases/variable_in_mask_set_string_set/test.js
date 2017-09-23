const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

describe('variable_in_mask_set_string_set', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  it('Test1', function (done) {
    const file = url.join('file://', __dirname, './Example.cmacc');

    cmacc.compile(file)
      .then(ast => {

        assert.equal(ast.first_Name, 'Willem');
        assert.equal(ast.last_Name, 'Veelenturf');

        assert.equal(ast.individual.first_Name, 'Willem');
        assert.equal(ast.individual.last_Name, 'Veelenturf');

        assert.equal(ast.entity.individual.first_Name, 'Willem');
        assert.equal(ast.entity.individual.last_Name, 'Veelenturf');

        assert.equal(ast.mask.entity.individual.first_Name, 'Willem');
        assert.equal(ast.mask.entity.individual.last_Name, 'Veelenturf');

        ast.first_Name = '1'
        ast.last_Name = '2'
        //ast.entity.individual.full_Name = '3'

        return ast;
      })
      .then(ast => {
        const resovle = (ast, root) => {

          Object.keys(ast).map((key) => {

            const path = root ? root + '.' + key : key;

            if (key.match(/^\$/)) {
              return;
            }

            if (typeof ast[key] === 'object') {
              resovle(ast[key], path)
            }

            if (typeof ast[key] === 'string'){

            }

            if (typeof ast[key] === 'string' && Object.getOwnPropertyDescriptor(ast, key).value) {
              console.log(path, ast[key])
            }

          });
        };
        resovle(ast)


        return ast;
      })
      .then(cmacc.render)
      .then(x => {
        return cmacc.remarkable.render(x)
      })
      .then(html => {
        const expect = `<p>Hello full name Willem Veelenturf</p>
`;
        assert.equal(html, expect);
        done();
      })
      .catch(done);

  });

});
const assert = require('assert');
const resolve = require('../../src/resolve');


describe('resolve', () => {

  const state = {}

  it('this', () => {

    const ast = {};

    return resolve('this', null, ast, state)
      .then(res => {
        assert.equal(res, ast);
      });

  });

  it('file', () => {

    const ast = {
      hello : 'Hello'
    };

    return resolve('[./hello.cmacc]', null, ast, state)
      .then(res => {
        assert.equal(res, [ '[./hello.cmacc]' ]);
      });

  });

  it('string', () => {

    const ast = {
      hello : 'Hello'
    };

    return resolve('"hello"', null, ast, state)
      .then(res => {
        assert.equal(res, [ '"hello"' ]);
      });

  });

  it('hello', () => {

    const ast = {
      hello : 'Hello'
    };

    return resolve('hello', null, ast, state)
      .then(res => {
        assert.deepEqual(res, [ 'Hello' ]);
      });

  });

});
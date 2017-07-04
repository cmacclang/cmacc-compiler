const assert = require('assert');

const path = require('path');

const fsMock = require('fs-mock');
const fetchMock = require('fetch-mock');

const loader = require('../../src/index').loader;

describe('loader', () => {

  const text = `$ world = "world"
# Hello {{world}}`;


  function fileMock(file){
    var data = {};
    data[path.join(__dirname, '../../', file)] = text;
    global.fs = new fsMock(data);
  }

  function httpMock(file){
    fetchMock.get(file, text);
  }


  it('text', (done) => {
    loader(text).then((res) => {
      assert.equal(res, text);
      done();
    });

  });

  it('local file relative ./', (done) => {
    const file = './test.cmacc';
    fileMock(file)
    loader(file).then((res) => {
      assert.equal(res, text);
      done();
    });
  });

  it('local file relative ../', (done) => {
    const file = '../cmacc-compiler/test.cmacc';
    loader(file).then((res) => {
      assert.equal(res, text);
      done();
    });
  });

  it('remote http absolute ', (done) => {
    const file = 'http://example.nl/test.cmacc';
    httpMock(file);
    loader(file).then((res) => {
      assert.equal(res, text);
      done();
    });
  });

  it('remote http relative and base', (done) => {
    httpMock('http://example.nl/test.cmacc');
    const base = 'http://example.nl/'
    const file = './test.cmacc';
    loader(file, base).then((res) => {
      assert.equal(res, text);
      done();
    });
  });



});
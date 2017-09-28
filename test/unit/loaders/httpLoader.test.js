const assert = require('assert');
const path = require('path');
const url = require('url');
const fetchMock = require('fetch-mock');
const loader = require('../../../src/loaders/httpLoader');

describe('httpLoader', () => {
  const text = `$ world = "world"
# Hello {{world}}`;

  function httpMock(file) {
    fetchMock.get(file, text);
  }

  it('loads from an absolute remote http address', done => {
    const file = 'http://example.nl/test.cmacc';
    httpMock(file);
    loader(url.parse(file))
      .then(res => {
        assert.equal(res.file, 'http://example.nl/test.cmacc');
        assert.equal(res.type, 'cmacc');
        assert.equal(res.data, text);
        done();
      })
      .catch(done);
  });
});

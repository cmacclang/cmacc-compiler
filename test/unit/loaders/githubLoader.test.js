const assert = require('assert');
const path = require('path');
const url = require('url');
const fetchMock = require('fetch-mock');
const loader = require('../../../src/loaders/githubLoader');

describe('githubLoader', function() {
  const text = `$ world = "world"
# Hello {{world}}`;

  describe('contentUrlLoader', function() {
    function httpMock(file) {
      fetchMock.get(file, text);
    }

    it('loads from the user content url when no base url is given', function(done) {
      const file = 'github:///owner/repo/branch/test.cmacc';
      const address = 'https://raw.githubusercontent.com/owner/repo/branch/test.cmacc';
      httpMock(address);

      let urlObj = url.parse(file);
      loader(urlObj, {})
        .then(res => {
          assert.equal(res.file, 'github:///owner/repo/branch/test.cmacc');
          assert.equal(res.type, 'cmacc');
          assert.equal(res.data, text);
          done();
        })
        .catch(done);
    });

    it('loads from the given base url', function(done) {
      const file = 'github:///owner/repo/branch/test.cmacc';
      const address = 'https://my-url.com/owner/repo/branch/test.cmacc';
      httpMock(address);

      let urlObj = url.parse(file);
      loader(urlObj, { githubContentUrl: 'https://my-url.com' })
        .then(res => {
          assert.equal(res.file, 'github:///owner/repo/branch/test.cmacc');
          assert.equal(res.type, 'cmacc');
          assert.equal(res.data, text);
          done();
        })
        .catch(done);
    });
  });

  describe('apiUrlLoader', function() {
    function httpMock(file) {
      fetchMock.get(file, JSON.stringify({ content: new Buffer(text).toString('base64') }));
    }
    let opts = { token: 'token' };

    it('loads from the api url when no base url is given', function(done) {
      const file = 'github:///owner/repo/branch/test.cmacc';
      const address = 'https://api.github.com/repos/owner/repo/contents/test.cmacc?ref=branch';
      httpMock(address);

      let urlObj = url.parse(file);
      loader(urlObj, opts)
        .then(res => {
          assert.equal(res.file, 'github:///owner/repo/branch/test.cmacc');
          assert.equal(res.type, 'cmacc');
          assert.equal(res.data, text);
          done();
        })
        .catch(done);
    });

    it('loads from the given base url', function(done) {
      const file = 'github:///owner/repo/branch/test.cmacc';
      const address = 'https://my-url.com/repos/owner/repo/contents/test.cmacc?ref=branch';
      httpMock(address);

      let urlObj = url.parse(file);
      opts.githubApiUrl = 'https://my-url.com';
      loader(urlObj, opts)
        .then(res => {
          assert.equal(res.file, 'github:///owner/repo/branch/test.cmacc');
          assert.equal(res.type, 'cmacc');
          assert.equal(res.data, text);
          done();
        })
        .catch(done);
    });
  });
});

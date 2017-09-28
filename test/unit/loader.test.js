const assert = require('assert');
const path = require('path');
const sinon = require('sinon');
const loader = require('../../src/index').loader;

describe('loader', () => {
  const text = `$ world = "world"
# Hello {{world}}`;

  it('returns text as cmacc typed fileless data', done => {
    loader(text)
      .then(res => {
        assert.equal(res.file, null);
        assert.equal(res.type, 'cmacc');
        assert.equal(res.data, text);
        done();
      })
      .catch(done);
  });

  it('returns a path with unknown protocol as cmacc typed fileless data', done => {
    let file = 'foo:///test.cmacc';
    loader(file)
      .then(res => {
        assert.equal(res.file, null);
        assert.equal(res.type, 'cmacc');
        assert.equal(res.data, file);
        done();
      })
      .catch(done);
  });

  it('uses a custom loader when given', () => {
    let fileLoaderSpy = sinon.spy();
    const opts = {
      loaders: { 'file:': fileLoaderSpy }
    };
    const file = 'file:///test.cmacc';

    loader(file, opts);
    assert(fileLoaderSpy.calledOnce);
  });

  it('resolves a relative path and base path to an absolute path', () => {
    let httpLoaderSpy = sinon.spy();
    const opts = {
      base: 'http://example.nl/',
      loaders: { 'http:': httpLoaderSpy }
    };
    const file = './test.cmacc';

    loader(file, opts);
    assert.equal(httpLoaderSpy.firstCall.args[0].href, 'http://example.nl/test.cmacc');
  });

  it('resolves a relative path to an absolute path', () => {
    let fileLoaderSpy = sinon.spy();
    const opts = {
      loaders: { 'file:': fileLoaderSpy }
    };
    const file = '../test.cmacc';

    loader(file, opts);
    const givenPath = fileLoaderSpy.firstCall.args[0].path;
    assert(givenPath.startsWith('/'));
    assert(givenPath.endsWith('/test.cmacc'));
  });
});

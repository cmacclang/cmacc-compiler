const assert = require('assert');
const path = require('path');
const url = require('url');
const fsMock = require('fs-mock');
const loader = require('../../../src/loaders/yarnLoader');

describe('yarnLoader', () => {
  const text = `$ world = "world"
# Hello {{world}}`;
  const dirname = path.join(__dirname, '../../..');

  function fileMock(file) {
    var data = {};
    data[path.join(dirname, 'node_modules', file)] = text;
    global.fs = new fsMock(data);
  }

  it('loads from a file in node_modules', done => {
    const file = './my-test-module/test.cmacc';
    fileMock(file);
    let urlObj = url.parse('yarn://my-test-module/test.cmacc');
    loader(urlObj, {})
      .then(res => {
        assert(res.file.startsWith('file://'));
        assert(res.file.endsWith('/my-test-module/test.cmacc'));
        assert.equal(res.type, 'cmacc');
        assert.equal(res.data, text);
        done();
      })
      .catch(done);
  });
});

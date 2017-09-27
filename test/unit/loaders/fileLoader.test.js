const assert = require('assert');
const path = require('path');
const url = require('url');
const fsMock = require('fs-mock');
const loader = require('../../../src/loaders/fileLoader');

describe('fileLoader', () => {
  const text = `$ world = "world"
# Hello {{world}}`;
  const dirname = path.join(__dirname, '../../../..');

  function fileMock(file) {
    var data = {};
    const fullPath = path.join(dirname, file);
    data[fullPath] = text;
    global.fs = new fsMock(data);
    return fullPath;
  }

  it('loads a local file', done => {
    const file = './test.cmacc';
    const fullPath = fileMock(file);
    const filePath = 'file://' + fullPath;
    let urlObj = url.parse(filePath);
    loader(urlObj)
      .then(res => {
        assert.equal(res.file, filePath);
        assert.equal(res.type, 'cmacc');
        assert.equal(res.data, text);
        done();
      })
      .catch(done);
  });

  it('loads a file with a space in the path', done => {
    const file = './cmacc-compiler/spa tie/test.cmacc';
    const fullPath = fileMock(file);
    const filePath = 'file://' + fullPath;
    let urlObj = url.parse(filePath);
    loader(urlObj)
      .then(res => {
        assert.equal(res.file, 'file://' + dirname + '/cmacc-compiler/spa tie/test.cmacc');
        assert.equal(res.type, 'cmacc');
        assert.equal(res.data, text);
        done();
      })
      .catch(done);
  });
});

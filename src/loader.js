const url = require('url');
const path = require('path');

const fileLoader = require('./loaders/fileLoader');
const yarnLoader = require('./loaders/yarnLoader');
const httpLoader = require('./loaders/httpLoader');
const githubLoader = require('./loaders/githubLoader');

const loader = (x, opts) => {
  opts = opts || {};

  if (x.indexOf('\n') > -1) {
    return defaultLoader(x, opts.base);
  }

  if (x.match(/^\.\//) || x.match(/^\.\.\//)) {
    x = resolveRelativePath(x, opts.base);
  }

  const urlObj = url.parse(x);

  if (fs && urlObj.protocol === 'file:') {
    return fileLoader(urlObj);
  }

  if (fs && urlObj.protocol === 'yarn:') {
    return yarnLoader(urlObj, opts.base);
  }

  if (fetch && (urlObj.protocol === 'http:' || urlObj.protocol === 'https:')) {
    return httpLoader(urlObj);
  }

  if (fetch && urlObj.protocol === 'github:') {
    if (opts.token) {
      return githubLoader.apiUrlLoader(urlObj, opts.token, opts.githubApiUrl);
    } else {
      return githubLoader.contentUrlLoader(urlObj, opts.githubContentUrl);
    }
  }

  return defaultLoader(x, opts.base);
};

// Resolve the given path to an absolute path.
const resolveRelativePath = (x, base) => {
  if (!base) {
    base = 'file://' + __dirname;
  }
  if (path.extname(base) !== '') {
    base = url.resolve(base, './');
  }
  return url.resolve(base, x);
};

// Return the file path itself as the data with the base path as file.
const defaultLoader = (x, base) => {
  return Promise.resolve({
    file: base,
    type: 'cmacc',
    data: x
  });
};

module.exports = loader;

const url = require('url');
const path = require('path');

const fileLoader = require('./loaders/fileLoader');
const yarnLoader = require('./loaders/yarnLoader');
const httpLoader = require('./loaders/httpLoader');
const githubLoader = require('./loaders/githubLoader');

// Default loaders per protocol
const loaders = {
  'file:': fileLoader,
  'yarn:': yarnLoader,
  'http:': httpLoader,
  'https:': httpLoader,
  'github:': githubLoader
};

const loader = (x, opts) => {
  opts = opts || {};

  if (x.indexOf('\n') > -1) {
    return defaultLoader(x, opts.base);
  }

  if (x.match(/^\.\//) || x.match(/^\.\.\//)) {
    x = resolveRelativePath(x, opts.base);
  }

  const urlObj = url.parse(x);

  var customLoaders = opts.loaders || {};
  var chosenLoader = customLoaders[urlObj.protocol] || loaders[urlObj.protocol];
  if (chosenLoader) {
    return chosenLoader(urlObj, opts);
  } else {
    return defaultLoader(x, opts.base);
  }
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

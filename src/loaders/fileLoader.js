const url = require('url');
const path = require('path');

const fileLoader = urlObj => {
  const promise = new Promise((resolve, reject) => {
    let file = decodeURI(urlObj.path);
    // windows path fixes
    // TODO: make a windows file loader
    if (process.platform === 'win32') {
      // The path is sometimes given as file://node_modules/... and
      // node_modules is considered the host.
      if (urlObj.host) {
        if (urlObj.host.match(/^[a-z]$/)) {
          file = decodeURI(path.join(urlObj.host + ':', urlObj.path));
        } else {
          file = decodeURI(path.join(urlObj.host, urlObj.path));
        }
      }
      // The path is sometimes given as /c:/..., remove the first '/'
      if (urlObj.path.match(/^\/[a-z]:\//)) {
        file = file.slice(1);
      }
    }

    fs.readFile(file, (err, data) => {
      if (err) return reject(err);
      resolve({
        file: decodeURI(url.format(urlObj)),
        type: path.extname(urlObj.path).slice(1).toLowerCase(),
        data: data.toString()
      });
    });
  });
  return promise;
};

module.exports = fileLoader;

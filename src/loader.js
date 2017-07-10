const url = require('url');
const path = require('path');

const loader = (x, base) => {

  const count = x.split("\n").length;

  if (count > 1) {
    return Promise.resolve({
      file: null,
      type: 'cmacc',
      data: x,
    })
  }

  // relative path
  if (x.match(/^\.\//) || x.match(/^\.\.\//)) {
    if (!base) {
      base = 'file:\/\/' + __dirname;
    }
    if (path.extname(base) !== '') {
      base = url.resolve(base, './')
    }
    x = url.resolve(base, x);
  }

  const urlObj = url.parse(x);

  // file
  if (fs && urlObj.protocol === 'file:') {
    const promise = new Promise((resolve, reject) => {
      fs.readFile(urlObj.path, (err, data) => {
        if (err) return reject(err);
        resolve({
          file: url.format(urlObj),
          type: path.extname(urlObj.path).slice(1).toLowerCase(),
          data: data.toString(),
        });
      });
    });
    return promise;
  }

  // http
  if (fetch && (urlObj.protocol === 'http:' || urlObj.protocol === 'https:')) {
    return fetch(x).then((y) => {
      return y.text().then(data => {
        return {
          file: url.format(urlObj),
          //ToDo: base on content type or extention
          type: 'NOT_IMPL',
          data: data.toString(),
        }
      });
    });
  }

  return Promise.resolve({
    file: null,
    type: 'cmacc',
    data: x,
  })

};

module.exports = loader;
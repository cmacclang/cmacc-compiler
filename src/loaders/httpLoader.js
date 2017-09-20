const url = require('url');
const path = require('path');

const httpLoader = urlObj => {
  return fetch(urlObj.href).then(y => {
    if (y.status != 200) throw new Error('File not found');

    return y.text().then(data => {
      return {
        file: url.format(urlObj),
        //ToDo: opts.base on content type or extention
        type: path.extname(urlObj.path).slice(1).toLowerCase(),
        data: data.toString()
      };
    });
  });
};

module.exports = httpLoader;

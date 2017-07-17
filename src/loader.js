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
      const file = decodeURI(urlObj.path)
      fs.readFile(file, (err, data) => {
        if (err) return reject(err);
        resolve({
          file: decodeURI(url.format(urlObj)),
          type: path.extname(urlObj.path).slice(1).toLowerCase(),
          data: data.toString(),
        });
      });
    });
    return promise;
  }

  // http
  if (fetch && (urlObj.protocol === 'http:' || urlObj.protocol === 'https:')) {
    console.log(x)
    return fetch(x).then((y) => {

      if (y.status != 200)
        throw new Error('File not found')

      return y.text().then(data => {
        return {
          file: url.format(urlObj),
          //ToDo: base on content type or extention
          type: path.extname(urlObj.path).slice(1).toLowerCase(),
          data: data.toString(),
        }
      });
    });
  }

  // github
  if (fetch && (urlObj.protocol === 'github:')) {

    const file = urlObj.path

    const match = file.match(/^\/([^\/]*)\/([^\/]*)\/([^\/]*)(.*)$/);

    const owner = match[1]
    const repo = match[2]
    const branch = match[3]
    const path1 = match[4]

    const base = 'https://api.github.com';
    const urlPath = path.join('repos', owner, repo, 'contents', path1);
    const location = url.resolve(base, urlPath);

    const opts = {
      headers: {
        'Authorization': "token " + global.token
      }
    };

    return fetch(location + '?ref=' + branch, opts)
      .then(x => x.json())
      .then((x) => {
        const base64 = x.content;
        const content = new Buffer(base64, 'base64')
        return {
          file: 'github://' + file,
          //ToDo: base on content type or extention
          type: path.extname(urlObj.path).slice(1).toLowerCase(),
          data: content.toString(),
        }
      });
  }


  return Promise.resolve({
    file: null,
    type: 'cmacc',
    data: x,
  })

};

module.exports = loader;
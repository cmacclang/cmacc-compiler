const url = require('url');
const path = require('path');

const loader = (x, base) => {

  const count = x.split("\n").length;

  if(count > 1){
    return Promise.resolve(x)
  }

  // relative path
  if(x.match(/^\.\//) || x.match(/^\.\.\//)) {
    if(!base){
      base = 'file:\/\/' + __dirname;
    }
    if(path.extname(base) !== ''){
      base = url.resolve(base, './')
    }
    x = url.resolve(base, x);
  }

  const parseUrl = url.parse(x);

  // file
  if(fs && parseUrl.protocol === 'file:'){
    const promise = new Promise((resolve, reject) => {
      fs.readFile(parseUrl.path, (err, data) => {
        if (err) reject(err);
        resolve(data.toString());
      });
    });
    return promise;
  }

  // http
  if(fetch && (parseUrl.protocol === 'http:' || parseUrl.protocol === 'https:')){
    return fetch(x).then((y) => {
      return y.text();
    });
  }

  return Promise.resolve(x)

};

module.exports = loader;
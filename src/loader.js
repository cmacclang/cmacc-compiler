const url = require('url');
const path = require('path');

const loader = (x, opts) => {

  opts = opts || {}

  const count = x.split("\n").length;

  if (count > 1) {
    return Promise.resolve({
      file: opts.base,
      type: 'cmacc',
      data: x,
    })
  }

  // relative path
  if (x.match(/^\.\//) || x.match(/^\.\.\//)) {
    if (!opts.base) {
      opts.base = 'file:\/\/' + __dirname;
    }
    if (path.extname(opts.base) !== '') {
      opts.base = url.resolve(opts.base, './')
    }
    x = url.resolve(opts.base, x);
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
    // console.log(x)
    return fetch(x).then((y) => {

      if (y.status != 200)
        throw new Error('File not found');

      return y.text().then(data => {
        return {
          file: url.format(urlObj),
          //ToDo: opts.base on content type or extention
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

    if (opts.token) {
      const base = opts.githubApiUrl || 'https://api.github.com';
      const urlPath = path.join('repos', owner, repo, 'contents', path1);
      const location = url.resolve(base, urlPath);

      const cont = {
        headers: {
          'Authorization': "token " + opts.token
        }
      };

      // console.log('fetch from github', location)

      return fetch(location + '?ref=' + branch, opts.token ? cont : null)
        .then(x => x.json())
        .then((x) => {
          const base64 = x.content;
          const content = new Buffer(base64, 'base64')
          return {
            file: 'github://' + file,
            //ToDo: opts.base on content type or extention
            type: path.extname(urlObj.path).slice(1).toLowerCase(),
            data: content.toString(),
          }
        })
        .catch(e => {
          throw new Error(`Cannot load file: ${location} ${branch} ${opts.token}`, e)
        });
    } else {
      const base = opts.githubContentUrl || 'https://raw.githubusercontent.com';
      const urlPath = path.join(owner, repo, branch, path1);
      const location = url.resolve(base, urlPath);
      return fetch(location)
        .then(res => res.text())
        .then(x => {
          // console.log(x)
          return {
            file: 'github://' + file,
            //ToDo: opts.base on content type or extention
            type: path.extname(urlObj.path).slice(1).toLowerCase(),
            data: x,
          }
        })
    }
  }

  // yarn
  if (fs && urlObj.protocol === 'yarn:') {

    const file = urlObj.path;

    const findRoot = require('find-root');
    const packageRoot = opts.base ? findRoot(opts.base.replace('file://', '')) : findRoot(process.cwd());
    const nodeModules = path.join(packageRoot, 'node_modules')

    const location = path.join(nodeModules, decodeURI(urlObj.host), decodeURI(urlObj.pathname));


    const promise = new Promise((resolve, reject) => {

      fs.readFile(location, (err, data) => {
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


  return Promise.resolve({
    file: opts.base,
    type: 'cmacc',
    data: x,
  })

};

module.exports = loader;
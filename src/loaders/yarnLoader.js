const path = require('path');

const yarnLoader = (urlObj, base) => {
  const file = urlObj.path;
  const findRoot = require('find-root');

  const check = dir => {
    const p = path.join(dir, 'node_modules', decodeURI(urlObj.host), decodeURI(urlObj.pathname));
    return fs.existsSync(p);
  };

  const packageRoot = base && base.match(/^file\:/) ? findRoot(base.replace('file://', ''), check) : findRoot(process.cwd(), check);
  const nodeModules = path.join(packageRoot, 'node_modules');

  const location = path.join(nodeModules, decodeURI(urlObj.host), decodeURI(urlObj.pathname));

  const promise = new Promise((resolve, reject) => {
    fs.readFile(location, (err, data) => {
      if (err) return reject(err);
      resolve({
        file: 'file://' + location,
        type: path.extname(urlObj.path).slice(1).toLowerCase(),
        data: data.toString()
      });
    });
  });

  return promise;
};

module.exports = yarnLoader;

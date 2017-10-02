const url = require('url');
const path = require('path');

const githubLoader = (urlObj, opts) => {
  if (opts.token) {
    return apiUrlLoader(urlObj, opts.token, opts.githubApiUrl);
  } else {
    return contentUrlLoader(urlObj, opts.githubContentUrl);
  }
};

// Load from Github via the API. Provide a token and an optional custom
// `baseUrl`.
const apiUrlLoader = (urlObj, token, baseUrl) => {
  var [owner, repo, branch, filePath] = parseGithubFile(urlObj.path);

  const base = baseUrl || 'https://api.github.com';
  const urlPath = path.join('repos', owner, repo, 'contents', filePath);
  const location = url.resolve(base, urlPath);

  const cont = {
    headers: {
      Authorization: 'token ' + token
    }
  };

  return fetch(location + '?ref=' + branch, token ? cont : null)
    .then(x => x.json())
    .then(x => {
      const file = urlObj.path;
      const base64 = x.content;
      const content = new Buffer(base64, 'base64');
      return {
        file: 'github://' + file,
        //ToDo: opts.base on content type or extention
        type: path.extname(urlObj.path).slice(1).toLowerCase(),
        data: content.toString()
      };
    })
    .catch(e => {
      throw new Error(`Cannot load file: ${location} ${branch} ${token}`);
    });
};

// Load from Github via the content url. Provide an optional custom `baseUrl`.
const contentUrlLoader = (urlObj, baseUrl) => {
  const file = urlObj.path;
  var [owner, repo, branch, filePath] = parseGithubFile(file);

  const base = baseUrl || 'https://raw.githubusercontent.com';
  const urlPath = path.join(owner, repo, branch, filePath);
  const location = url.resolve(base, urlPath);
  return fetch(location).then(res => res.text()).then(x => {
    return {
      file: 'github://' + file,
      //ToDo: opts.base on content type or extention
      type: path.extname(urlObj.path).slice(1).toLowerCase(),
      data: x
    };
  });
};

// Return the owner, repository, branch and path respectively given the file
// path.
const parseGithubFile = file => {
  const match = file.match(/^\/([^\/]*)\/([^\/]*)\/([^\/]*)(.*)$/);
  return match.slice(1, 5);
};

module.exports = githubLoader;

#! /usr/bin/env node

var fs = require('fs');
var md = require('marked');
var path = require('path');
var url = require('url');

var cmacc = require('../src/index');

var input = process.argv[2] || './index.cmacc';
var output = process.argv[3] || path.basename(input, path.extname(input));

var file = input

if (!url.parse(input).protocol) {
  file = 'file://' + path.resolve(process.cwd(), input);
}

global.fs = require('fs');
global.fetch = require('node-fetch');

cmacc.compile(file)
  .then(cmacc.render)
  .then(x => {
    return cmacc.remarkable.render(x)
  })
  .then(html => {
    fs.writeFileSync(path.resolve(process.cwd(), output + '.html'), html);
  })
  .catch((e) => {
    console.error('Message:', e.message);
    console.error('Stack:', e.stack);
    console.error('File:', e.file);
  });





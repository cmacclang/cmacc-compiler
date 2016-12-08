#! /usr/bin/env node

var fs = require('fs');
var md = require('marked');
var path = require('path');
var url = require('url');

var index = require('../src/index');

var compile = index.compile;
var resolve = index.resolve;

var input = process.argv[2] || './index.cmacc';
var output = process.argv[3] || path.basename(input, path.extname(input));

try{
    var file = input
    if(!url.parse(input).protocol){
        file = 'file://' + path.resolve(process.cwd(), input);
    }

    var ast = compile(file);
    var resolved = resolve(ast);
    var rendered = md(resolved);
}catch (e){
    console.error('Message:', e.message);
    console.error('Stack:', e.stack);
    console.error('File:', e.file);
}

fs.writeFileSync(path.resolve(process.cwd(), output+ '.html'), rendered);
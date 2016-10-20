var parse = require('./parse');
var bind = require('./bind');

function compile(file) {
    var ast = parse(file);
    // console.log(JSON.stringify(ast, null, 4));
    var bound = bind(ast);
    // console.log(JSON.stringify(ast, null, 4));
    return bound;
}

module.exports = compile;

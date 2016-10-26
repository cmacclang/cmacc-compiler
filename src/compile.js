var parse = require('./parse');
var bind = require('./bind');

function compile(file) {
    var ast = parse(file);
    var bound = bind(ast);
    return bound;
}

module.exports = compile;

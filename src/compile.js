var parse = require('./parse');
var bind = require('./bind');

function compile(file, options) {

    var ast = parse(file, null, options);
    var bound = bind(ast);
    return bound;
}

module.exports = compile;

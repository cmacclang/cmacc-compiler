var merge = require('./merge');

function bind(ast) {

    var keys = Object.keys(ast);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!key.match(/\$\$(.*)\$\$/) && ast[key] && ast[key].$$mrg$$) {
            ast[key] = merge(ast[key], ast[key].$$mrg$$);
        }

        if (!key.match(/\$\$(.*)\$\$/) && ast[key])
            bind(ast[key])
    }


    return ast;

}

module.exports = bind;

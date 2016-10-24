var merge = require('./merge');

function bind(ast) {

    var keys = Object.keys(ast);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!key.match(/\$\$(.*)\$\$/) && ast[key].$$mrg$$) {
            ast[key] = merge(ast[key], ast[key].$$mrg$$);
            delete ast[key].$$mrg$$;
        }

        if (!key.match(/\$\$(.*)\$\$/))
            bind(ast[key])
    }


    return ast;

}

module.exports = bind;

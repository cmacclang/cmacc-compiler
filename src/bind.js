var assert = require('assert');
var resolve = require('./resolve');

var merge = require('./merge');

function bind(ast) {

    if (ast.$$mrg$$) {
        var keys = Object.keys(ast.$$mrg$$);
        for (var i = 0; i < keys.length; i++) {
            ast[keys[i]] = merge(ast[keys[i]], ast.$$mrg$$[keys[i]]);
            delete ast.$$mrg$$[keys[i]];
        }
        delete ast.$$mrg$$;

    }

    if (ast.$$text$$) {
        var matches = {};
        ast.$$text$$ = ast.$$text$$.replace(/{{.+?}}/g, function(match) {
            match = match.slice(2, -2);
            var key = match.split('.')[0];
            var result = bind(eval('ast.' + match));
            matches[match] = result;
            if (result.$$text$$) {
                return result.$$text$$
            } else if (result.$$str$$) {
                result.$$str$$ = result.$$str$$.replace(/{{.+?}}/g, function(match) {
                    match = match.slice(2, -2);
                    var retrieve = key + '.' + match;
                    return matches[retrieve].$$str$$;
                });
                return result.$$str$$;
            }
        });
    }

    return ast;

}

module.exports = bind;

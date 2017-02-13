function find(ast) {
    var res = {};

    var keys = Object.keys(ast);

    for (var i = 0; i < keys.length; i++) {

        var key = keys[i];

        if (!key.match(/\$\$(.*)\$\$/) && ast[key] == null)
            res[key] = null;

        if (!key.match(/\$\$(.*)\$\$/) && ast[key] && ast[key].$$str$$)
            res[key] = ast[key].$$str$$;

        if (!key.match(/\$\$(.*)\$\$/) && ast[key] && !ast[key].$$str$$)
            res[key] = find(ast[key])

    }

    return res;
}

module.exports = find;
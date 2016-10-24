function resolve(obj) {


    var keys = Object.keys(obj);

    for (var i = 0; i < keys.length; i++) {

        var key = keys[i];


        if (typeof obj[key] === 'object') {
            obj[key] = resolve(obj[key]);
        }

    }

    if (obj['$$text$$']) {
        obj['$$text$$'] = replaceVars(obj['$$text$$'], obj);
        return obj.$$text$$;
    }

    return obj;
}

function replaceVars(str, obj) {

    var REGEX = /\{\{([\w\.\_]+)\}\}/g

    return str.replace(REGEX, function (match, qry) {
        var val = findInAst(qry, obj);
        return val;
    });

}

function findInAst(qry, ast) {

    var i = 0
    var stack = [];
    var spl = qry.split('.');

    stack.push(ast);

    spl.forEach(function (key) {
        stack.push(stack[i][key]);
        i++;
    });

    if(stack[i] && stack[i].$$str$$) {
        return replaceVars(stack[i].$$str$$, stack[i - 1])
    }

    return stack[i];

}

module.exports = resolve;

function resolve(obj) {

    if (obj['$$text$$']) {
        return replaceVars(obj['$$text$$'], obj);
    }

    return obj;

}

function replaceVars(str, obj) {

    var REGEX = /\{\{([\w\.\_]+)\}\}/g

    return str.replace(REGEX, function (match, qry) {
        var val = findInAst(qry, obj);
        return resolve(val);
    });

}

function findInAst(qry, ast) {

    var i = 0;
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

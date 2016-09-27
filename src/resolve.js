function resolve(obj) {


    var keys = Object.keys(obj);

    for (var i = 0; i < keys.length; i++) {

        var key = keys[i];

        if (obj[key] && typeof obj[key] === 'string' && key !== '$$file$$' && key !== '$$text$$') {
            obj[key] = replaceVars(obj[key], obj);
        }

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

    var spl = qry.split('.');
    var cur = ast;

    spl.forEach(function (str) {

        if (cur && cur[str]) {
            cur = cur[str];
            return;
        }

        return cur = null
    });

    if (!cur)
        cur = '!!' + qry + '!!';

    return cur;

}

module.exports = resolve;

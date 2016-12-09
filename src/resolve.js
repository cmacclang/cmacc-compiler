var REGEX_EOL = /\n/;
var REGEX_VAR = /\{\{([\w\.\_]+)\}\}/g;
var REGEX_NUM = /^(\s*)([\-\d\+]\.\s)(.*)/;

function resolve(obj, opts) {

    if (obj && obj['$$text$$']) {
        return replaceVars(obj['$$text$$'], obj, opts);
    }

    return '';

}

function spacesString(num) {
    var res = ''
    for (var i = 0; i < num; i++) {
        res += ' ';
    }
    return res;
}

function replaceVars(str, obj, opts) {

    return str.split(REGEX_EOL).map(function (line) {
        return line.replace(REGEX_VAR, function (match, qry, pos) {

            var val = findInAst(qry, obj);

            if(!val && typeof val !== 'string')
                return '!!' + qry + '!!'

            if (typeof val === 'object') {
                var res = resolve(val);
                if(typeof res === 'string') {
                    return concatString(res, qry, pos, opts)
                }
            }

            if(typeof val === 'string')
                return concatString(val, qry, pos, opts)

            return ''

        });

    }).join('\n');

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

    if (stack[i] && (stack[i].$$str$$)) {
        return replaceVars(stack[i].$$str$$, stack[i].$$obj$$)
    }


    return stack[i];

}

function concatString(res, qry, pos, opts) {

    var firstLine = true;

    return res.split(REGEX_EOL).map(function (line) {

        var match = line.match(REGEX_NUM);

        var spaces = firstLine ? '' : spacesString(pos);
        firstLine = false;

        if (opts && opts.debug) {
            if (match && match.length >= 3)
                return spaces + match[1] + match[2] + '<cmacc-variable name="' + qry + '">' + match[3] + '</cmacc-variable>';
            else
                return spaces + '<cmacc-variable name="' + qry + '">' + line + '</cmacc-variable>';
        }

        return spaces + line;


    }).join('\n');

}

module.exports = resolve;

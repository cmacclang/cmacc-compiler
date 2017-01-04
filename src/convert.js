var fs = require('fs');
var path = require('path');
var url = require('url');

var marked = require('marked');
var regex = require('./regex');
var merge = require('./merge');
var fetch = require('./fetch');

function convert(file, options) {
    var res = 'var $$obj$$ = {};';
    var vars = [];

    var text = null;

    try {
        text = fetch(file, options);
    } catch (e) {
        throw(e)
    }

    var md = text.replace(regex.REGEX_VARIABLE, function (match, key, ref, val) {

        if(key.match(/\./)) {
            res += key + ' = ';
        }else{
            vars.push(key);
            res += 'var ' + key + ' = ';
        }
        if (ref) {

            var resolve;

            // absolute path
            if (url.parse(ref).protocol) {
                resolve = ref;
            }

            // relative path
            else {
                var urlObj = url.parse(file);

                if (urlObj.protocol) {
                    var dir = path.dirname(urlObj.pathname);
                    urlObj.pathname = path.resolve(dir, ref);
                    resolve = url.format(urlObj);
                } else {
                    resolve = options.path + '/' + ref;
                }

            }

            if (val) {
                res += 'parse(' + JSON.stringify(resolve) + ', string(' + val + ', $$obj$$), ' + JSON.stringify(options) + ');';
            } else {
                res += 'parse(' + JSON.stringify(resolve) + ', null, ' + JSON.stringify(options) + ');';
            }

        } else if (!ref) {
            if (val) {
                res += 'string(' + val + ', $$obj$$);';
            } else {
                res += 'null';
            }
        }
        res += ';\n\n';
        return '';
    });

    // remove comments
    md = md.replace(regex.REGEX_COMMENT_SLASH, '');

    // remove enters
    md = md.replace(/^[\;\n]*/, '');


    if (vars.length > 0) {
        vars.forEach(function (vari) {
            res += '$$obj$$.' + vari + ' =  ' + vari + ' ; '
            });
    }

    if (md) {
        res += '$$obj$$.$$text$$ = ' + JSON.stringify(md) + ';';
    }

    res += '$$obj$$.$$file$$ = ' + JSON.stringify(file) + ';';

    res += 'module.exports = $$obj$$;';

    try {
        return res;
    } catch (e) {
        e.res = res;
        e.file = file;
        throw(e)
    }

}

module.exports = convert;

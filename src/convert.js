var fs = require('fs');
var path = require('path');
var url = require('url');

var marked = require('marked');
var regex = require('./regex');
var merge = require('./merge');
var fetch = require('./fetch');

function convert(file, options) {
    var res = '';
    var vars = [];

    var text = null;

    try {
        text = fetch(file);
    } catch (e) {
        throw(e)
    }

    var md = text.replace(regex.REGEX_VARIABLE, function (match, key, ref, val) {

        vars.push(key);
        res += 'var ' + key + ' = ';
        if (ref) {

            var resolve;

            // absolute path
            if (url.parse(ref).protocol) {
                resolve = ref;
            }

            // relative path
            else {
                var urlObj = url.parse(file);

                if(urlObj.protocol){
                    var dir = path.dirname(urlObj.pathname);
                    urlObj.pathname = path.resolve(dir, ref);
                    resolve = url.format(urlObj);
                } else{
                    resolve = options.path + '/' + ref;
                }

            }

            if (val) {
                res += 'parse(' + JSON.stringify(resolve) + ',string(' + val + '));';
            } else {
                res += 'parse(' + JSON.stringify(resolve) + ');';
            }

        } else if (!ref) {
            if (val) {
                res += 'string(' + val + ');';
            }else {
                res += 'null';
            }
        }
        res += ';\n\n';
        return '';
    });

    md = md.replace(/^[\;\n]*/, '');

    res += 'module.exports = {';
    res += vars.map(function (vari) {
            return '\t' + vari + ' : ' + vari
        }).join(',') + ',';

    if (md)
        res += '$$text$$ : ' + JSON.stringify(md) + ',';

    res += '$$file$$ : ' + JSON.stringify(file);
    res += '};';


    try {
        return res;
    } catch (e) {
        e.res = res;
        e.file = file;
        throw(e)
    }

}

module.exports = convert;

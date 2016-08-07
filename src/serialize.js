var path = require('path');
var async = require('async');

var regex = require('./regex');
var helper = require('./helper');

var serialize = function (ast, callback, edit) {

    var source = "";
    ast.variables.forEach(function (variable) {

        source += "$ ";
        if (edit) source += '<cmacc-variable ref="' + variable.loc + '">';
        source += variable.key;
        if (edit) source += '</cmacc-variable>';
        source += " = ";

        if (variable.ref) {
            source += "[";
            if (edit) source += '<cmacc-link ref="' + variable.ref + '">';
            source += variable.ref;
            if (edit) source += '</cmacc-link>';
            source += "] => ";
        }

        if (variable.variables)
            source += json(variable.variables);
        else
            source += "\"" + variable.val + "\"";

        source += "\n\n";
    });

    if (ast.text)
        source += ast.text + "\n"

    callback(null, source)
};

var json = function (variables) {

    var res = '';
    if (variables.length > 0) {
        res += '{';
        variables.forEach(function (variable) {
            if (variable.over) {
                res += "\n\t\"" + variable.key + "\"" + ' : ';
                if (variable.type === 'string')
                    res += "\"" + variable.val + "\"";
                else
                    res += variable.val;
            }
        });
        res += "\n" + '}';
    }

    return res
}

module.exports = serialize;
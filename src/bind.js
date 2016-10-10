var assert = require('assert');

var merge = require('./merge');

function bind(ast) {

    // Bind variables
    for (var i in ast) {

        if(ast['$$mrg$$'] && ast['$$mrg$$'][i] && ast['$$mrg$$'][i].$$str$$){
            merge(ast[i], ast['$$mrg$$'][i])
            console.log(ast[i])
            console.log(ast['$$mrg$$'][i])
        }


        if(typeof ast[i] === 'object' && !ast[i].$$str$$){
            bind(ast[i])
        }

    }
};

module.exports = bind;

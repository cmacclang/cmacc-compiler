var assemble = require('./assemble');
var reduce = require('./reduce');
var bind = require('./bind');

function compile(file, opts = {}) {

  return assemble(file, opts.base)
    .then(bind)
    .then(reduce);

}

module.exports = compile;

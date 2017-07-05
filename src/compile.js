var assemble = require('./assemble');
var reduce = require('./reduce');

function compile(file, opts = {}) {

  return assemble(file, opts.base)
    .then(reduce);

}

module.exports = compile;

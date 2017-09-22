const assemble = require('./assemble');
const reduce = require('./reduce');
const validate = require('./validate');

function compile(file, opts) {

  opts = opts || {}

  return assemble(file, opts)
    .then(reduce)
    .then(validate)


}

module.exports = compile;

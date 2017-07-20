const assemble = require('./assemble');
const reduce = require('./reduce');
const validate = require('./validate');
const bind = require('./bind');

function compile(file, opts) {

  opts = opts || {}

  return assemble(file, opts)
    .then(x =>{
      //console.log(JSON.stringify(x, null, 2))
      return x
    })
    .then(bind)
    .then(x =>{
      // console.log(JSON.stringify(x, null, 2))
      return x
    })
    .then(reduce)
    .then(validate)


}

module.exports = compile;

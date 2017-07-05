var assemble = require('./assemble');
var reduce = require('./reduce');

function compile(file) {

  return assemble(file).then(res => {
    return reduce(res);
  })

}

module.exports = compile;

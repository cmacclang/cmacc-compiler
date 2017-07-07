const validator = require('jsonschema').validate;

function validate(ast) {

  Object.keys(ast).forEach(function (key) {
    const val = ast[key];

    if(ast['$schema$']){
      const opts = {
        throwError: true
      };
      const schema = ast['$schema$'];
      validator(ast, schema, opts);
    }

    if (typeof val === 'object') {
      validate(val)
    }

  });

  return ast

}

module.exports = validate;

const find = require('./find');

function bind(ast) {

  if(!ast.vars)
    return ast

  ast.vars.forEach(function (x) {

    const from = find(x.name, ast);

    if (x.type === 'link') {

      if(from.data && from.data.type === 'schema') {
        x.data['$schema$'] = from.data.data
      }
      from.data = x.data
    }

    if (x.type === 'variable') {
      const to = find(x.data, ast);
      from.type = to.type
      from.data = to.data

    }

    if (x.type === 'function') {
      const MATCH_FUNCTION = /^(.*)\((.*)\)$/;
      const match = x.data.match(MATCH_FUNCTION)
      const func = match[1];
      const args = match[2] ? match[2].split(",") : [];
      const val = find(func, ast);
      const input = args.map(x => find(x, ast)).map(x => x.data.data)
      from.data = val.data.data.apply({}, input)
    }

  });

  ast.vars.forEach(function (x) {

    if (x.type === 'link') {
      bind(x.data)
    }

  });

  return ast



}

module.exports = bind;
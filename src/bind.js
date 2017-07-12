function find(ast, name) {

  return ast.vars.reduce((a, b) => {

    if (b.name === name)
      a = b;

    return a;

  }, null)
}

function bind(ast) {

  if(!ast.vars)
    return ast

  ast.vars.forEach(function (x) {

    if (x.type === 'variable') {
      const from = x.name.split('.').reduce((a, b) => find(a.data, b), {data: ast});
      if(!from) throw new Error(`Cannot set property ${x.name} in file ${ast.file}`);

      const to = x.data.split('.').reduce((a, b) => find(a.data, b), {data: ast});
      if(!from) throw new Error(`Cannot get property ${x.data} in file ${ast.file}`);

      from.data = to.data
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
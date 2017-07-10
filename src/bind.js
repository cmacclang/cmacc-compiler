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
      const to = x.data.split('.').reduce((a, b) => find(a.data, b), {data: ast});
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
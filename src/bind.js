


function bind(ast) {

  function prop(v){
    const res = v.split('.').reduce((a, b) => find(a.data, b), {data: ast});
    if(!res)throw new Error(`Cannot find property ${v} in file ${ast.file}`);
    return res
  }

  function find(ast, name) {

    if(!ast.vars) {
      ast = {}
      ast['vars'] = {}
      ast['vars'][name] = {}
      return ast['vars'][name];
    }

    return ast.vars.reduce((a, b) => {
      if (b.name === name) a = b;
      return a;
    }, null)

  }

  if(!ast.vars)
    return ast

  ast.vars.forEach(function (x) {

    const from = prop(x.name);


    if(from.data && from.data.type === 'schema') {
      console.log(x.data)
      x.data['$schema$'] = from.data.data
    }

    if (x.type === 'link') {

      from.data = x.data
    }

    if (x.type === 'variable') {
      const to = prop(x.data);
      from.data = to.data

    }

    if (x.type === 'function') {
      const MATCH_FUNCTION = /^(.*)\((.*)\)$/;
      const match = x.data.match(MATCH_FUNCTION)
      const func = match[1];
      const args = match[2] ? match[2].split(",") : [];
      const val = prop(func);
      const input = args.map(prop).map(x => x.data.data)
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
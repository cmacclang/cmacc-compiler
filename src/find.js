function find(variable, ast){

  function reduce(ast, name) {

    if(!ast || !ast.vars) {
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

  const res = variable.split('.').reduce((a, b) => {
    if(!a){
      throw new Error(`Cannot find property ${variable} in file ${ast.file}`);
    }
    return reduce(a.data, b)
  }, {data: ast});

  if(!res){
    throw new Error(`Cannot find property ${variable} in file ${ast.file}`);
  }

  return res;
}


module.exports = find;
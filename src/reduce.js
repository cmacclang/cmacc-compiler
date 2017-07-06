function reduce(ast) {

  const vars = ast.vars.reduce((acc, x) => {



    if (x.data.type === 'cmacc')
      acc[x.name] = reduce(x.data);
    else{
      const split = x.name.split('.');
      const last = split.pop();
      const val = split.reduce((acc, val) => acc[val], acc);
      val[last] = x.data;
    }

    return acc;

  }, {});

  vars['$md$'] = ast.md;
  vars['$meta$'] = ast.meta;
  vars['$type$'] = ast.type;
  vars['$value$'] = ast.value;
  vars['$name$'] = ast.name;

  return vars;

}

module.exports = reduce;

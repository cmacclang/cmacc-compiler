function reduce(ast) {

  const vars = ast.vars.reduce((acc, x) => {

    if (x.data.type === 'cmacc')
      acc[x.name] = reduce(x.data);
    else{
      acc[x.name] = x.data;
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

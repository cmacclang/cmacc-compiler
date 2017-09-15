function resolve(variable, ast) {

  if (variable === 'this') {
    return Promise.resolve(ast);
  }

  if (variable.match(/^\[(.*)\]$/)) {
    return Promise.resolve(variable);
  }

  if (variable.match(/^['"](.*)['"]$/)) {
    return Promise.resolve(variable);
  }

  const res = variable
    .split('.')
    .reduce((ast, val) => {
      if (!ast || !ast[val]) {
        throw new Error(`Cannot find variable '${variable}' in file '${ast['$file$']}'`);
      }
      return ast[val]
    }, ast);

  return Promise.resolve(res);

}

module.exports = resolve;

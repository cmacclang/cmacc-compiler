function resolve(variable, ast) {


  if (variable === 'this') {
    return Promise.resolve(ast);
  } else if (variable.match(/^\[(.*)\]$/)) {
    return Promise.resolve(variable);
  } else if (variable.match(/^['"](.*)['"]$/)) {
    return Promise.resolve(variable);
  } else {
    const split = variable.split('.');
    const last = split.pop();
    const res = split.reduce((ast, val) => ast[val], ast);
    if(!res || !res[last]){
      throw new Error(`Cannot find variable '${variable}' in file '${ast['$file$']}'`);
    }
    return Promise.resolve(res[last]);
  }

}

module.exports = resolve;

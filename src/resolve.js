function resolve(variable, ast) {


  if (variable === 'this') {
    return ast;
  } else if (variable.match(/^\[(.*)\]$/)) {
    return variable;
  } else if (variable.match(/^['"](.*)['"]$/)) {
    return variable;
  } else {
    const split = variable.split('.');
    const last = split.pop();
    const res = split.reduce((ast, val) => ast[val], ast);
    if(!res[last]){
      throw new Error(`Cannot find variable '${variable}' in file '${ast['$file$']}'`);
    }
    return res[last];
  }

}

module.exports = resolve;

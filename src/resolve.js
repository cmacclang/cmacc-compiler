function resolve(placeholder, ast, state) {

  const opts = {
    base: ast['$file']
  };

  const match = placeholder.match(/{{(?:#(.*)\s)?([^}]*)}}/);
  const helper = match[1];

  return Promise.resolve(match[2])
    .then(variable => {

      if (variable === 'this') {
        return ast;
      }

      if (variable.match(/^\[(.*)\]$/)) {
        return variable;
      }

      if (variable.match(/^['"](.*)['"]$/)) {
        return variable;
      }

      const split = variable.split('.')
      const last = split.pop();
      const sub = split
        .reduce((ast, val) => {

          if (!ast || typeof ast[val] === 'undefined') {
            throw new Error(`Cannot find variable '${variable}' in file '${ast['$file']}'`);
          }

          return ast[val]
        }, ast);

      if (!sub || typeof sub[last] === 'undefined') {
        throw new Error(`Cannot find variable '${variable}' in file '${sub['$file']}'`);
      }


      if (typeof sub[last] === 'string') {

        return Promise.all(sub[last]
          .split(/({{[^}]*}})/)
          .filter(str => str != "")
          .map(placeholder => {
            const matches = placeholder.match(/{{(?:#(.*)\s)?([^}]*)}}/)

            if (!matches) {
              return placeholder;
            }

            const key = matches[2];

            const propAst = Object.getOwnPropertyDescriptor(sub, last).get.getAst();
            if (!matches[1]) {
              return resolve(`{{${key}}}`, propAst, state)
            } else {
              return resolve(`{{#${matches[1]} ${key}}}`, propAst, state)
            }

          }))
          .then(x => x.join(''))
      }

      return sub[last];

    })
    .then(value => helper ? state.helpers[helper](value, ast, opts) : value)

}

module.exports = resolve;

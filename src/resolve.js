function resolve(placeholder, ast, state) {

  const opts = {
    base: ast['$file$']
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

      const res = variable
        .split('.')
        .reduce((ast, val) => {
          if (!ast || !ast[val]) {
            throw new Error(`Cannot find variable '${variable}' in file '${ast['$file$']}'`);
          }
          return ast[val]
        }, ast);

      if (typeof res === 'string') {

        return Promise.all(res.split(/({{[^}]*}})/)
          .filter(str => str != "")
          .map(placeholder => {
            const matches = placeholder.match(/{{(?:#(.*)\s)?([^}]*)}}/)

            if (!matches) {
              return placeholder;
            }

            const key = variable.split('.').slice(0, -1).concat(matches[2].split('.')).join('.');

            if (!matches[1]) {
              return resolve(`{{${key}}}`, ast, state)
            } else {
              return resolve(`{{#${matches[1]} ${key}}}`, ast, state)
            }

          }))
          .then(x => x.join(''))
      }

      return res;

    })
    .then(x => helper ? state.helpers[helper](x, ast, opts) : x)

}

module.exports = resolve;

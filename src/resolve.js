function resolve(value, helper, ast, state) {

  const opts = {
    base: ast['$file']
  };

  return Promise.resolve(value)
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

      if(sub[last] && sub[last].getAst)
        sub[last] = sub[last].getAst()

      if (!sub || typeof sub[last] === 'undefined') {
        throw new Error(`Cannot find variable '${variable}' in file '${sub['$file']}'`);
      }


      // if (typeof sub[last] === 'string') {
      //
      //   return Promise.all(sub[last]
      //     .split(/({{[^}]*}})/)
      //     .filter(str => str != "")
      //     .map(placeholder => {
      //       const matches = placeholder.match(/{{(?:#(.*)\s)?([^}]*)}}/)
      //
      //       if (!matches) {
      //         return placeholder;
      //       }
      //
      //       const key = matches[2];
      //
      //       const propAst = Object.getOwnPropertyDescriptor(sub, last).get.getAst();
      //       if (!matches[1]) {
      //         return resolve(`{{${key}}}`, propAst, state)
      //       } else {
      //         return resolve(`{{#${matches[1]} ${key}}}`, propAst, state)
      //       }
      //
      //     }));
      //
      // }

      return sub[last];

    })
    .then(value => {
      if(helper){
        if(Array.isArray(value)){
          return state.helpers[helper](value.join(''), ast, opts)
        }
        return state.helpers[helper](value, ast, opts)
      }
      return value
    })

}

module.exports = resolve;

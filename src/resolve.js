function resolve(variable, helper, ast, opts, state) {


  opts = opts || {base : ast['$file']}

  return Promise.resolve(variable)
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
              return resolve(key, null, propAst, opts, state)
            } else {
              return resolve(key, matches[1], propAst, opts, state)
            }

          }))

      }

      return sub[last];

    })
    .then(value => {

      if(helper && Array.isArray(value)){
        return  state.helpers[helper](value.join(''), ast, opts)
      }
      if(helper){
        return  state.helpers[helper](value, ast, opts)
      }
      return value;
    })

}

module.exports = resolve;

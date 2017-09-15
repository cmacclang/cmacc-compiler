const helpers = require('./helpers');
const resolve = require('./resolve');

function render(ast, state) {

  const opts = {
    base: ast['$file$']
  };

  if (!state) {
    state = {
      helpers: helpers()
    }
  }

  function item(x) {

    if (x.type === 'htmlblock') {
      x.content = x.content.replace(/{{([^{]*)}}/g, function (match, name) {
        return ast[name];
      });
      return Promise.resolve(x);
    }

    if (x.type === 'placeholder_block' || x.type === 'placeholder_inline') {

      const match = x.variable.match(/(?:#(.*)\s)?(.*)/);

      const helper = match[1];
      const variable = match[2];

      return resolve(variable, ast).then((value) => {

          if (helper) {

            if (!state.helpers[helper]) {
              throw new Error(`Helper '${helper}' does not exist `);
            }

            return state.helpers[helper](value, ast, opts)
              .then(content => {
                return {
                  type: 'htmlblock',
                  content: content,
                  variable: x.variable,
                }
              });

          }

          if (value == null || typeof value === 'undefined') {
            const res = {
              type: 'text',
              content: `{{${x.variable}}}`,
              variable: x.variable,
            };
            return Promise.resolve(res);
          }

          if (typeof value === 'string') {
            return Promise.resolve(value)
              .then(value => {
                return value
                  .split(/({{[^{]*})/)
                  .filter(str => str != "");
              })
              .then(arr => {
                const res = arr.map(x => {
                  const matches = x.match(/{{(?:#(.*)\s)?([^}]*)}}/)

                  if(!matches){
                    return Promise.resolve(x);
                  }

                  const helper = matches[1];
                  const name = matches[2];
                  const key = variable.split('.').slice(0, -1).concat(name.split('.')).join('.');
                  if (helper) {
                    return resolve(key, ast)
                      .then(x => state.helpers[helper](x, ast, opts))
                  }
                  return resolve(key, ast)
                });

                return Promise.all(res)
              })
              .then(arr => {
                return arr.map(content => {
                  return {
                    type: 'htmlblock',
                    content: content,
                    variable: x.variable,
                  }
                })
              })
          }

          if (typeof value === 'object') {

            if (value.then) {
              return value.then(x => {
                const res = {
                  type: 'text',
                  content: x,
                  variable: x.variable,
                };
                return res;
              })
            }

            return render(value, state).then(res => {
              if (x.type === 'placeholder_inline' && res.length === 3 && res[0].type === 'paragraph_open' && res[2].type === 'paragraph_close')
                return res[1].children;
              else
                return res;
            });

          }
        }
      );

    }

    return Promise.resolve(x);

  }

  if (ast['$md$']) {
    return Promise.all(ast['$md$']
      .map(x => {

        x.children = x.children || [];

        const children = x.children.map(child => item(child).then((res) => {
          if (Array.isArray(res) && res.reduce((acc, cur) => acc ? acc : (cur.type !== 'text' && cur.type !== 'htmlblock'), false)) {
            throw new Error(`Cannot render ref inline for param: ${child.variable} in file ${ast['$file$']}`);
          }
          return res;
        }));

        return Promise.all(children)
          .then(res => res.reduce((acc, val) => {
            return acc.concat(val);
          }, []))
          .then(res => {
            x.children = res;
            return item(x)
          })
      }))
      .then(res => res.reduce((acc, val) => {
        return acc.concat(val);
      }, []))

  } else {
    return Promise.resolve([]);
  }

}

module.exports = render;

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

      const value = resolve(variable, ast);

      if (helper) {

        if (!state.helpers[helper]){
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
        const res = {
          type: 'text',
          content: value.replace(/{{(?:#(.*)\s)?([^{]*)}}/g, function (match, helper, name) {
            const x = variable.split('.').slice(0, -1).concat(name.split('.')).join('.');
            if (helper) {
              return state.helpers[helper](resolve(x, ast), ast, opts);
            }
            return resolve(x, ast)
          }),
          variable: x.variable,
        };
        return Promise.resolve(res);
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

    return Promise.resolve(x);

  }

  if (ast['$md$']) {
    return Promise.all(ast['$md$']
      .map(x => {

        x.children = x.children || [];

        const children = x.children.map(child => item(child).then((res) => {
          if (Array.isArray(res) && res.reduce((acc, cur) => acc ? acc : cur.type !== 'text', false)) {
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

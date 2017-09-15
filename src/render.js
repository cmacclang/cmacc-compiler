const helpers = require('./helpers');
const resolve = require('./resolve');

function render(ast, state) {

  if (!state) {
    state = {
      helpers: helpers()
    }
  }

  function item(x) {

    if (x.type === 'htmlblock') {
      x.content = x.content.replace(/{{([^}]*)}}/g, function (match, name) {
        return ast[name];
      });
      return Promise.resolve(x);
    }

    if (x.type === 'placeholder_block' || x.type === 'placeholder_inline') {

      const placeholder = x.content;

      const match = placeholder.match(/{{(?:#(.*)\s)?([^}]*)}}/);

      const helper = match[1];
      const variable = match[2];

      return resolve(placeholder, ast, state)
        .then(value => {

            if (helper) {
              return Promise.resolve({
                type: 'htmlblock',
                content: value,
                variable: x.variable,
              })

            }

            if (value == null || typeof value === 'undefined') {
              const res = {
                type: 'text',
                content: placeholder,
                variable: x.variable,
              };
              return Promise.resolve(res);
            }

            if (typeof value === 'string') {

              const res = {
                type: 'htmlblock',
                content: value,
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

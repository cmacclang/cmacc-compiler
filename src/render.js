const helpers = require('./helpers');
const resolve = require('./resolve');

function render(ast, state) {

  if (!state) {
    state = {
      helpers: helpers()
    }
  }

  if (ast['$md']) {

    return Promise.all(ast['$md']
      .map(x => {

        x.children = x.children || [];

        const children = x.children
          .map(child => item(child).then((res) => {
            if (Array.isArray(res) && res.reduce((acc, cur) => acc ? acc : (cur.type !== 'variable_open' && cur.type !== 'variable_close' && cur.type !== 'text' && cur.type !== 'htmlblock'), false)) {
              throw new Error(`Cannot render ref inline for param: ${child.variable} in file ${ast['$file']}`);
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


  function item(x) {

    if (x.type === 'htmlblock') {
      x.content = x.content.replace(/{{([^}]*)}}/g, function (match, name) {
        return ast[name];
      });
      return Promise.resolve(x);
    }

    if (x.type === 'placeholder_block' || x.type === 'placeholder_inline') {

      const placeholder = x.content;

      return resolve(placeholder, ast, state)
        .then(value => {

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

              if (Array.isArray(value)) {
                return value.map(x => {
                  return {
                    type: 'text',
                    content: x
                  }
                });
              }

              return render(value, state).then(res => {
                res.variable = x.variable
                if (x.type === 'placeholder_inline' && res.length === 5 && res[1].type === 'paragraph_open' && res[3].type === 'paragraph_close')
                  return res[2].children;
                else
                  return res;
              });

            }
          }
        );

    }

    return Promise.resolve(x);

  }

}

module.exports = render;

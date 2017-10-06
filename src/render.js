const helpers = require('./helpers');
const resolve = require('./resolve');

function render(ast, opts, state) {

  if (!state) {
    state = {
      helpers: helpers()
    }
  }

  if (ast['$md']) {

    return Promise.all(ast['$md']
      .map(x => {

        x.children = x.children || [];

        const types = [
          'text',
          'htmlblock',
          'placeholder_block_open',
          'placeholder_block_close',
          'placeholder_inline_open',
          'placeholder_inline_close',
        ];

        const children = x.children
          .map(child => item(child)
            .then((res) => {
              if (Array.isArray(res) && res.reduce((acc, cur) => acc ? acc : (types.indexOf(cur.type) < 0), false)) {
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

      const match = x.content.match(/{{(?:#(.*)\s)?([^}]*)}}/);

      return resolve(match[2], match[1], ast, opts, state)
        .then(value => {

            if (value == null || typeof value === 'undefined') {
              const res = {
                type: 'text',
                content: x.content,
                variable: x.variable,
              };
              return Promise.resolve(res);
            }

            if (Array.isArray(value)) {

              const res = value.map(y => {
                return {
                  type: 'htmlblock',
                  content: y,
                  variable: x.variable,
                }
              });

              return [].concat(
                {
                  type: x.type + '_open',
                  path: ast['$path'].concat(match[2]),
                },
                res,
                {
                  type: x.type + '_close',
                  path: ast['$path'].concat(match[2]),
                });

            }

            if (typeof value === 'string') {

              const res = [
                {
                  type: x.type + '_open',
                  path: ast['$path'].concat(match[2]),
                },
                {
                  type: 'htmlblock',
                  content: value,
                  variable: x.variable,
                },
                {
                  type: x.type + '_close',
                  path: ast['$path'].concat(match[2]),
                }
              ];

              return res;

            }

            if (typeof value === 'object') {

              return render(value, opts, state).then(res => {
                if (x.type === 'placeholder_inline' && res.length === 3 && res[0].type === 'paragraph_open' && res[2].type === 'paragraph_close')
                  return [].concat(
                    {
                      type: x.type + '_open',
                      path: ast['$path'].concat(match[2]),
                    },
                    res[1].children,
                    {
                      type: x.type + '_close',
                      path: ast['$path'].concat(match[2]),
                    });
                else
                  return [].concat(
                    {
                      type: x.type + '_open',
                      path: ast['$path'].concat(match[2]),
                    },
                    res,
                    {
                      type: x.type + '_close',
                      path: ast['$path'].concat(match[2]),
                    });
              });

            }
          }
        );

    }

    return Promise.resolve(x);

  }

}

module.exports = render;

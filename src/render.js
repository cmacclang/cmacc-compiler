const helpers = require('./helpers');

function render(ast) {

  function item(x) {

    if (x.children)
      x.children = x.children
        .map(child => {
          const res = item(child)
          if (Array.isArray(res) && res.reduce((acc, cur) => acc ? acc : cur.type !== 'text', false)) {
            // console.log(x.type)
            throw new Error(`Cannot render ref inline for param: ${child.variable} in file ${ast['$file$']}`);
          } else {
            return res;
          }
        })
        .reduce((acc, val) => {
          return acc.concat(val);
        }, []);


    if (x.type === 'htmlblock') {
      x.content = x.content.replace(/{{([^{]*)}}/g, function (match, name) {
        return ast[name];
      });
      return x;
    }

    if (x.type === 'placeholder_block' || x.type === 'placeholder_inline') {

      const match = x.variable.match(/(?:#(.*)\s)?(.*)/);

      const helper = match[1];
      const variable = match[2];

      const split = variable.split('.');
      const last = split.pop();
      const res = split.reduce((ast, val) => ast[val], ast);

      const val = res[last];

      if (helper) {
        if (!helpers[helper])
          throw new Error(`Helper '${helper}' does not exist `);

        const res = helpers[helper](val)
        return res
      }

      if (val == null || typeof val === 'undefined') {
        return {
          type: 'text',
          content: `{{${x.variable}}}`,
          variable: x.variable,
        };
      }

      if (typeof val === 'string') {
        return {
          type: 'text',
          content: val.replace(/{{([^{]*)}}/g, function (match, name) {
            return res[name]
          }),
          variable: x.variable,
        };
      }

      if (typeof val === 'object') {
        const res = render(val);
        if (x.type === 'placeholder_inline' && res.length === 3 && res[0].type === 'paragraph_open' && res[2].type === 'paragraph_close')
          return res[1].children;
        else
          return res;
      }

    }

    return x;

  }

  if (ast['$md$']) {
    return ast['$md$']
      .map(item)
      .reduce((acc, val) => {
        return acc.concat(val);
      }, []);
  } else {
    return [];
  }

}

module.exports = render;

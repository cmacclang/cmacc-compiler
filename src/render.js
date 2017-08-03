const helpers = require('./helpers');

function render(ast) {

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

      const split = variable.split('.');
      const last = split.pop();
      const res = split.reduce((ast, val) => ast[val], ast);

      const val = res[last];

      if (helper) {
        if (!helpers[helper])
          throw new Error(`Helper '${helper}' does not exist `);

        const res = helpers[helper](val);
        return Promise.resolve(res);
      }

      if (val == null || typeof val === 'undefined') {
        const res = {
          type: 'text',
          content: `{{${x.variable}}}`,
          variable: x.variable,
        };
        return Promise.resolve(res);
      }

      if (typeof val === 'string') {
        const res = {
          type: 'text',
          content: val.replace(/{{([^{]*)}}/g, function (match, name) {
            return res[name]
          }),
          variable: x.variable,
        };
        return Promise.resolve(res);
      }

      if (typeof val === 'object') {

        if (val.then) {
          return val.then(x => {
            const res = {
              type: 'text',
              content: x,
              variable: x.variable,
            };
            return res;
          })
        }

        return render(val).then(res => {
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

        x.children = x.children || []

        children = x.children.map(child => item(child).then((res) => {
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

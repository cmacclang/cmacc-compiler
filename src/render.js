const helpers = require('./helpers');

function render(ast) {

  function item(x) {

    if (x.children)
      x.children = x.children
        .map(x => {
          const res = item(x)
          if (Array.isArray(res))
            throw new Error(`Cannot render ref inline for param: ${x.variable}`);
          else
            return res;
        });


    if (x.type === 'htmlblock') {
      x.content = x.content.replace(/{{([^{]*)}}/g, function (match, name) {
        return ast[name];
      });
      return x;
    }

    if (x.type === 'placeholder') {

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

        return helpers[helper](val)
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
        return render(val);
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

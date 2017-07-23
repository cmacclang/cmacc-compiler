function render(ast) {

  function item(x) {

    if (x.children)
      x.children = x.children.map(item);


    if (x.type === 'htmlblock') {
      x.content = x.content.replace(/{{([^{]*)}}/g, function (match, name) {
        return ast[name];
      });
      return x;
    }

    if (x.type === 'placeholder') {

      const split = x.variable.split('.');
      const last = split.pop();
      const res = split.reduce((ast, val) => ast[val], ast);

      if(!res || !res[last])
        throw new Error(`Cannot read property '${last}' in file ${ast['$file$']}`)

      const val = res[last]

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
    return []
  }

}

module.exports = render;

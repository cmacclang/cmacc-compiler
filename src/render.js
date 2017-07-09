function render(ast) {

  const MATCH_VARIABLE = /\{\{([\w\.]*)\}\}/g;

  function repace(x) {

    if (x.children) {
      x.children.map(repace)
    }

    if (x.type === 'text' || x.type === 'htmlblock') {
      x.content = x.content.replace(MATCH_VARIABLE, function (res, variable) {
        const val = variable.split('.').reduce((acc, val) => acc[val], ast);

        if (typeof val === 'string')
          return val;

        if (typeof val === 'object')
          return render(val)

      })
    }

    return x
  }

  const arr = ast['$md$']
    .map((x) => {

      if (x.type === 'placeholder') {

        MATCH_VARIABLE.lastIndex = 0;
        const match = MATCH_VARIABLE.exec(x.content);
        const key = match[1];
        const val = key.split('.').reduce((a, b) => a[b], ast)

        if (typeof val === "object")
          return render(val);

        if (typeof val === "string")
          return [{
            type: 'text',
            content: val}];

        throw new Error(`cannot find ${key}`)
      }

        return [x].map(repace)
      }
      )
    .reduce((acc, val) => {
      return acc.concat(val);
    }, []);

  return arr;
}

module.exports = render;

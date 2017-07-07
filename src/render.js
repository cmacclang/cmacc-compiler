function render(ast) {

  const MATCH_VARIABLE = /\{\{([\w\.]*)\}\}/g;

  function repace(x) {

    if(x.children){
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
        const key = MATCH_VARIABLE.exec(x.content)[1];
        return render(ast[key])
      }

      return [x].map(repace)
    })
    .reduce((acc, val) => {
      return acc.concat(val);
    }, []);

  return arr;
}

module.exports = render;

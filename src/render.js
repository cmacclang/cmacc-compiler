const MATCH_VARIABLE = /\{\{(.*)\}\}/;

function render(ast) {

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
        const key = x.content.match(MATCH_VARIABLE)[1];
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

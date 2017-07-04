var loader = require('./loader');
var parser = require('./parser');
var variables = require('./variables');

function compile(file) {

  return loader(file).then((text) => {
    const res = parser(text);
    const vars = variables(res.vars);

    const ast = vars.map((x) => {
      if (x.type === 'cmacc') {
        return compile(x.value)
          .then(res => {
            x.data = res;
            return x;
          })
      }
      x.data = x.value
      return Promise.resolve(x)
    });

    return Promise.all(ast).then(x => {
      return {
        "type": res.type,
        "md": res.md,
        "meta": res.meta,
        "vars": x,
      };
    })

  });

}

module.exports = compile;

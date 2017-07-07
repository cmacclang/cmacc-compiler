var loader = require('./loader');
var parser = require('./parser');
var variables = require('./variables');

function assemble(file, base) {

  return loader(file, base).then((res) => {

    if (res.type === 'schema') {
      const data = {
        type: res.type,
        data: JSON.parse(res.data),
      };
      return Promise.resolve(data)
    }

    if (res.type === 'js') {
      const data = {
        type: res.type,
        data: eval(res.data),
      };
      return Promise.resolve(data)
    }

    const md = parser(res.data);
    const vars = variables(md.vars);

    const ast = vars.map((x) => {

      if (x.type === 'cmacc') {
        return assemble(x.value, base || file)
          .then(res => {
            x.data = res;
            return x;
          })
      }


      x.data = x.value;
      return Promise.resolve(x)

    });

    return Promise.all(ast)
      .then(x => {
        return {
          "type": md.type,
          "md": md.md,
          "meta": md.meta,
          "vars": x,
        };
      })

  });

}

module.exports = assemble;

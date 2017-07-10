var loader = require('./loader');
var parser = require('./parser');
var variables = require('./variables');

function assemble(file, base) {

  return loader(file, base).then((res) => {

    if (res.type === 'string' || res.type === 'json' || res.type === 'schema') {
      const data = {
        file: res.file,
        type: res.type,
        data: JSON.parse(res.data),
      };
      return Promise.resolve(data)
    }

    if (res.type === 'variable') {
      const data = {
        type: res.type,
        data: JSON.parse(res.data),
      };
      return Promise.resolve(data)
    }

    if (res.type === 'js') {
      const data = {
        file: res.file,
        type: res.type,
        data: eval(res.data),
      };
      return Promise.resolve(data)
    }

    if (res.type === 'cmacc') {
      const md = parser(res.data);
      const ast = variables(md.vars).map((x) => {

        if (x.type === 'link') {
          return assemble(x.value, base || file)
            .then(res => {
              x.data = res;
              return x;
            })
        }

        if (x.type === 'object') {
          x.data = JSON.parse(x.value);
          return Promise.resolve(x)
        }

        x.data = x.value;
        return Promise.resolve(x)

      });

      return Promise.all(ast)
        .then(x => {
          return {
            file: res.file,
            type: md.type,
            md: md.md,
            meta: md.meta,
            vars: x,
          };
        })
    }

  });

}

module.exports = assemble;

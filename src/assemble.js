const path = require('path');

const loader = require('./loader');
const parser = require('./parser');
const variables = require('./variables');

function assemble(file, opts) {

  opts = opts || {}

  return loader(file, opts).then((res) => {

    if (res.type === 'json' || res.type === 'schema') {
      const data = {
        file: res.file,
        type: res.type,
        data: JSON.parse(res.data),
      };
      return Promise.resolve(data)
    }

    if (res.type === 'js') {
      const dirname = path.dirname(res.file.replace('file://', ''))
      const source = res.data.replace(/require\('((.*))'\)/, (match, reqi) => {
        return `require('${path.resolve(dirname, reqi)}')`
      });
      const data = {
        file: res.file,
        type: res.type,
        data: eval(source),
      };
      return Promise.resolve(data)
    }

    if (res.type === 'cmacc') {
      const md = parser(res.data);
      const ast = variables(md.vars, res.file).map((x) => {

        if (x.type === 'link') {
          opts = opts || {};
          if(res.file !== null) {
            opts.base = res.file
          };
          return assemble(x.value, opts)
            .then(res => {
              x.data = res;
              return x;
            })
        }

        if (x.type === 'object') {
          x.data = JSON.parse(x.value);
          return Promise.resolve(x)
        }

        if (x.type === 'function') {
          x.data = x.value;
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

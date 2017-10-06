function reduce(ast) {

  ast.path = ast.path || [];

  const vars = ast.vars.reduce((acc, x) => {

    if (x.data && x.data.type === 'json') {
      acc[x.name] = x.data.data;
      return acc;
    }

    if (x.data && x.data.type === 'js') {
      acc[x.name] = x.data.data;
      return acc;
    }

    if (x.type === 'function') {
      const MATCH_FUNCTION = /^(.*)\((.*)\)$/;
      const match = x.data.match(MATCH_FUNCTION)
      const func = match[1];
      const args = match[2] ? match[2].split(",") : [];
      const input = args.map(x => ast[x]).map(x => x.data)
      const val = acc[func];
      const data = val.apply({}, input);
      acc[x.name] = data;
      return acc;
    }

    const splitName = x.name.split('.');
    const lastName = splitName.pop();
    const astName = splitName.reduce((a, b) => a[b], acc);

    if (x.type === 'link') {
      x.data.name = x.name;
      x.data.value = x.value;
      x.data.path = ast.path.concat(x.name);
      astName[lastName] = reduce(x.data);
      return acc;
    }

    if (x.type === 'variable') {

      const defineGetter = function(){
        const splitValue = x.value.split('.');
        const lastValue = splitValue.pop();
        const astValue = splitValue.reduce((a, b) => a[b], acc);
        return astValue[lastValue];
      };
      defineGetter.getAst = function(){
        const splitValue = x.value.split('.');
        const lastValue = splitValue.pop();
        const astValue = splitValue.reduce((a, b) => a[b], acc);
        if(Object.getOwnPropertyDescriptor(astValue, lastValue).get){
          return Object.getOwnPropertyDescriptor(astValue, lastValue).get.getAst();
        }
        return astValue;
      };
      astName.__defineGetter__(lastName, defineGetter);

      astName.__defineSetter__(lastName, (set) => {
        const splitValue = x.value.split('.');
        const lastValue = splitValue.pop();
        const astValue = splitValue.reduce((a, b) => a[b], acc);
        astValue[lastValue] = set;
      });

      return acc;
    }

    const defineGetter = function(){
      return x.data;
    };
    defineGetter.getAst = function(){
      return acc;
    };
    astName.__defineGetter__(lastName, defineGetter);

    astName.__defineSetter__(lastName, (set) => {
      x['data'] = set;
    });

    return acc;

  }, {});

  if (ast.type === 'schema') {
    vars['$schema'] = ast.data;
  }

  vars['$file'] = ast.file;
  vars['$data'] = ast.data;
  vars['$md'] = ast.md;
  vars['$meta'] = ast.meta;
  vars['$type'] = ast.type;
  vars['$value'] = ast.value;
  vars['$name'] = ast.name;
  vars['$path'] = ast.path;

  return vars;

}

module.exports = reduce;

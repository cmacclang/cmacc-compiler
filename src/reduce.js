function reduce(ast) {

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
      const input = args.map(x => find(x, ast)).map(x => x.data)
      const val = acc[func];
      const data = val.apply({}, input)
      acc[x.name] = data;
      return acc;
    }

    if (x.data && (x.data.type === 'cmacc' || x.data.type === 'schema')) {
      acc[x.name] = reduce(x.data);
      return acc;
    }

    const split = x.name.split('.');
    const last = split.pop();
    const val = split.reduce((a, b) => a[b], acc);

    if (x.type === 'variable') {

      const s = x.value.split('.');
      const l = s.pop();
      const v = s.reduce((a, b) => a[b], acc);

      val.__defineGetter__(last, () => {
        return v[l];
      });

      val.__defineSetter__(last, (x) => {
        v[l] = x;
      });

      return acc;
    }

    val[last] = x.data;

    return acc;

  }, {});

  if (ast.type === 'schema') {
    vars['$schema'] = ast.data;
  }

  vars['$file'] = ast.file;
  vars['$md'] = ast.md;
  vars['$meta'] = ast.meta;
  vars['$type'] = ast.type;
  vars['$value'] = ast.value;
  vars['$name'] = ast.name;

  return vars;

}

module.exports = reduce;

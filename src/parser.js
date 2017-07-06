const Remarkable = require('remarkable');

function parse(text) {

  const md = new Remarkable();
  md.use(require('remarkable-meta'));
  md.use(require('remarkable-variables'));

  const res = md.parse(text,{})

  return {
    type: "cmacc",
    meta : md.meta,
    vars : md.variables || [],
    md : res,
  };
}

module.exports = parse;
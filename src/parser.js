const remarkable = require('./remarkable');

function parse(text, opts) {

  const res = remarkable.parse(text, opts)

  return {
    type: "cmacc",
    meta : res.meta,
    vars : res.vars,
    md : res.md,
  };
}

module.exports = parse;
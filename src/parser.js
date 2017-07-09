const remarkable = require('./remarkable');

function parse(text) {

  const res = remarkable.parse(text,{})

  return {
    type: "cmacc",
    meta : res.meta,
    vars : res.vars,
    md : res.md,
  };
}

module.exports = parse;
var loader = require('./loader');
var parser = require('./parser');

function variables(vars) {

  const MATCH_STRING = /^[\'\"](.*)[\'\"]$/;
  const MATCH_OBJECT = /^{(.*)}$/;
  const MATCH_LINK = /^\[(.*)\]$/;

  function typeConverter(x) {
    if (x === "null") return "null";
    if (x.match(MATCH_STRING)) return "string";
    if (x.match(MATCH_OBJECT)) return "object";
    if (x.match(MATCH_LINK)) return "link";
    return "variable";
  };

  return vars.map((x) => {
    const found = x.match(/([\w\.]*)\s?=\s?(.*)/);
    const name = found[1].trim();
    const value = found[2].trim();
    const type = typeConverter(value);
    return {
      type: type,
      name: name,
      value: type === "null" ? null : value.replace(MATCH_STRING, "$1").replace(MATCH_LINK, "$1"),
    }
  })

}

module.exports = variables;

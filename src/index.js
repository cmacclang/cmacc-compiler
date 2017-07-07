const Remarkable = require('remarkable');
const md = new Remarkable();

var cmacc = {
  parser: require('./parser'),
  render: require('./render'),
  loader: require('./loader'),
  compile: require('./compile'),
  variables: require('./variables'),
  assemble: require('./assemble'),
  reduce: require('./reduce'),
  validate: require('./validate'),
  remarkable: md,
};

module.exports = cmacc;
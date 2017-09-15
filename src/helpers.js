const loader = require('./loader');
const parser = require('./parser');

module.exports = () => {

  const sectionState = [0, 0, 0, 0, 0, 0];
  const referenceState = {};

  const location = (ast) => {
    return Promise.resolve(ast['$file$']);
  };

  const filename = (ast) => {
    const arr = ast['$file$'].split('/')
    return Promise.resolve(arr[arr.length - 1]);
  };

  const reference = (ast) => {
    const number = referenceState[ast['$file$']];
    return Promise.resolve(number);
  };

  const section = (str, ast) => {
    const val = str.match(/^['"]?([^'"]*)['"]?$/)[1];
    const split = val.split('.');
    const pos = split.length;
    for (let i = 0; i < 6; i++) {
      if (i === pos - 1) {
        sectionState[i] = sectionState[i] + 1 || 1;
      }
      if (i > pos - 1) {
        sectionState[i] = 0
      }
    }

    const number = sectionState.slice(0, pos).join('.');

    if (!referenceState[ast['$file$']]) {
      referenceState[ast['$file$']] = number;
    }

    return Promise.resolve(number)
  };

  const definition = (val, ast, opts) => {

    if (typeof val === 'object') {
      const ast = val;
      const definition = ast['$meta$']['Definition']
      return Promise.resolve(`<a href="#${definition.replace(' ', '-')}">${definition}</a>`);
    }

    if (typeof val === 'string') {
      const file = val.match(/^\[(.*)\]$/)[1];
      return loader(file, opts)
        .then((text) => {
          const ast = parser(text.data)
          const definition = ast['meta']['Definition'];

          if (!definition)
            throw new Error(`definition not found in file ${ast['$file$']}`);

          return Promise.resolve(`<a href="#${definition.replace(' ', '-')}">${definition}</a>`);
        })
    }
  };

  return {location, filename, section, reference, definition};

};




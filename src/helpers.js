const loader = require('./loader');
const parser = require('./parser');

const location = (ast) => {
  return {
    type: 'text',
    content: ast['$file$'],
  };
};

const filename = (ast) => {
  const arr = ast['$file$'].split('/')
  return {
    type: 'text',
    content: arr[arr.length-1]
  };
};

const definition = (val, opts) => {

  console.log('-----', val)

  if(typeof val === 'object'){
    const ast = val;
    const definition = ast['$meta$']['Definition']
    const res = {
      type: 'htmlblock',
      content: `<a href="#${definition.replace(' ','-')}">${definition}</a>`
    };
    return Promise.resolve(res)
  }

  if(typeof val === 'string'){
    const file = val.match(/^\[(.*)\]$/)[1];
    return loader(file, opts)
      .then((text) => {
        const ast = parser(text.data)
        const definition = ast['meta']['Definition'];

        if(!definition)
          throw new Error(`definition not found in file ${ast['$file$']}`);

        return {
          type: 'htmlblock',
          content: `<a href="#${definition.replace(' ','-')}">${definition}</a>`
        };
      })
  }





};

module.exports = {location, filename, definition};
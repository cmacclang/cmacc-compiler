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

var sectionState = [0,0,0,0,0,0]
const section = (str) => {
  const val = str.match(/^['"](.*)['"]$/)[1];
  const split = val.split('.');
  const pos = split.length
  for(let i=0;i<6;i++){
    if(i === pos-1){
      sectionState[i] = sectionState[i] + 1 || 1;
    }
    if(i > pos-1){
      sectionState[i] = 0
    }
  }

  console.log(sectionState)
  const res = {
    type: 'text',
    content: sectionState.slice(0, pos).join('.')
  };
  return Promise.resolve(res)
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

module.exports = {location, filename, section, definition};
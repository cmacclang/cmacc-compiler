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

const definition = (ast) => {
  const definition = ast['$meta$']['Definition']

  if(!definition)
    throw new Error(`definition not found in file ${ast['$file$']}`);
  return {
    type: 'htmlblock',
    content: `<a href="#${definition.replace(' ','-')}">${definition}</a>`
  };
};

module.exports = {location, filename, definition};
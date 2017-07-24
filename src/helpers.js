const file = (ast) => {
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

module.exports = {file, filename};
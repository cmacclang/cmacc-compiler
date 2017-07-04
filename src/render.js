const Remarkable = require('remarkable');


function render(ast) {

  const MATCH_VARIABLE = /\{\{(.*)\}\}/;

  const md = new Remarkable();

  function repace(x) {
    if (x.type === 'text' || x.type === 'htmlblock') {
      x.content = x.content.replace(MATCH_VARIABLE, function (res, variable) {
        const val = variable.split('.').reduce((acc, val) => acc[val], ast);

        if (typeof val === 'string')
          return val;
        else
          return render(val)
      })
    }

    return x
  }

  const arr = ast['$md$'].map((x) => {

    if (x.type === 'placeholder') {
      console.log('placeholder')
      x.type = 'htmlblock'
      x = repace(x);
      return x
    }

    if (x.children) {
      x.children.map(repace)
    }

    return x
  });

  const html = md.renderer.render(arr, {})

  return html;
}

module.exports = render;

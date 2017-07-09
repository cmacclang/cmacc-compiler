const Remarkable = require('remarkable');



module.exports = {
  parse: function (x) {
    const md = new Remarkable({
      html: true
    });
    md.use(require('remarkable-meta'));
    md.use(require('remarkable-variables'));
    return {
      md: md.parse(x,{}),
      vars: md.variables || [],
      meta: md.meta,
    }
  },

  render: function (x) {
    const md = new Remarkable({
      html: true
    });
    md.use(require('remarkable-meta'));
    md.use(require('remarkable-variables'));
    return md.renderer.render(x)
  }
};

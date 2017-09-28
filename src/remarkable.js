const Remarkable = require('remarkable');

const customRenderer = function (md, opts) {

  md.renderer.rules['variable_open'] = function (tokens, idx) {
    const token = tokens[idx];
    return `<cmacc-block variable="${token['path']/*.join('.')*/}">`
    return '';
  };

  md.renderer.rules['variable_close'] = function (tokens, idx) {
    return `</cmacc-block>`
    return '';
  };

};

module.exports = {
  parse: function (x) {
    const md = new Remarkable({
      html: true
    });
    md.use(require('remarkable-meta'));
    md.use(require('remarkable-variables'));
    md.use(customRenderer);

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
    md.use(customRenderer);
    return md.renderer.render(x, {})
  }
};

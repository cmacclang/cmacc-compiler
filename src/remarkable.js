const Remarkable = require('remarkable');

function placeholderPlugin(md) {

  md.renderer.rules['placeholder_block_open'] = function (tokens, idx) {
    return '';
    const token = tokens[idx];
    return `<cmacc-placeholder-block variable="${token['path'].join('.')}">`
  };

  md.renderer.rules['placeholder_block_close'] = function (tokens, idx) {
    return '';
    const token = tokens[idx];
    return `</cmacc-placeholder-block>`
  };

  md.renderer.rules['placeholder_inline_open'] = function (tokens, idx) {
    return '';
    const token = tokens[idx];
    return `<cmacc-placeholder-inline variable="${token['path'].join('.')}">`
  };

  md.renderer.rules['placeholder_inline_close'] = function (tokens, idx) {
    return '';
    const token = tokens[idx];
    return `</cmacc-placeholder-inline>`
  };

};

module.exports = {
  parse: function (x) {
    const md = new Remarkable({
      html: true
    });
    md.use(require('remarkable-meta'));
    md.use(require('remarkable-variables'));
    md.use(placeholderPlugin);
    return {
      md: md.parse(x, {}),
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
    md.use(placeholderPlugin);
    return md.renderer.render(x, {})
  }
};

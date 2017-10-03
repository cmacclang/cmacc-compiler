const Remarkable = require('remarkable');

function placeholderPlugin(debug) {

  return function (md) {

    md.renderer.rules['placeholder_block_open'] = function (tokens, idx) {

      if (debug) {
        const token = tokens[idx];
        return `<cmacc-placeholder-block variable="${token['path'].join('.')}">`
      }
      return '';

    };

    md.renderer.rules['placeholder_block_close'] = function (tokens, idx) {
      if (debug) {
        const token = tokens[idx];
        return `</cmacc-placeholder-block>`
      }
      return '';
    };

    md.renderer.rules['placeholder_inline_open'] = function (tokens, idx) {
      if (debug) {
        const token = tokens[idx];
        return `<cmacc-placeholder-inline variable="${token['path'].join('.')}">`
      }
      return '';
    };

    md.renderer.rules['placeholder_inline_close'] = function (tokens, idx) {
      if (debug) {
        const token = tokens[idx];
        return `</cmacc-placeholder-inline>`
      }
      return '';
    };

  };

}

module.exports = {
  parse: function (x, debug) {
    const md = new Remarkable({
      html: true
    });
    md.use(require('remarkable-meta'));
    md.use(require('remarkable-variables'));
    md.use(placeholderPlugin(debug));
    return {
      md: md.parse(x, {}),
      vars: md.variables || [],
      meta: md.meta,
    }
  },

  render: function (x, debug) {
    const md = new Remarkable({
      html: true
    });
    md.use(require('remarkable-meta'));
    md.use(require('remarkable-variables'));
    md.use(placeholderPlugin(debug));
    return md.renderer.render(x, {})
  }
};

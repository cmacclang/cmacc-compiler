const Remarkable = require('remarkable');

function customRenderer(opts){

  opts = opts || {}

  return function (md) {

    md.renderer.rules['variable_open'] = function (tokens, idx) {
      const token = tokens[idx];
      if(opts.debug){
        return `<cmacc-${token['varType']} variable="${token['path']/*.join('.')*/}">`
      }
      return '';
    };

    md.renderer.rules['variable_close'] = function (tokens, idx) {
      const token = tokens[idx];

      if(opts.debug){
        return `</cmacc-${token['varType']}>`
      }
      return '';
    };

  }
};

module.exports = {
  parse: function (x, opts) {
    const md = new Remarkable({
      html: true
    });
    md.use(require('remarkable-meta'));
    md.use(require('remarkable-variables'));
    md.use(customRenderer(opts));

    return {
      md: md.parse(x,{}),
      vars: md.variables || [],
      meta: md.meta,
    }
  },

  render: function (x, opts) {
    const md = new Remarkable({
      html: true
    });
    md.use(require('remarkable-meta'));
    md.use(require('remarkable-variables'));
    md.use(customRenderer(opts));
    return md.renderer.render(x, {})
  }
};

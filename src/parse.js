var merge = require('./merge');
var convert = require('./convert');

function parse(file, $$ob$$) {

    var src = convert(file);
    var js = eval(src)

    if($$ob$$)
        return merge(js, $$ob$$);
    else
        return js;

}

module.exports = parse;

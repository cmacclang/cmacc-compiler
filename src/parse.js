var merge = require('./merge');
var bind = require('./bind');
var convert = require('./convert');

function parse($$file$$, $$obj$$) {

    var $$src$$ = eval(convert($$file$$))

    bind($$src$$);

    if ($$obj$$)
        $$src$$['$$obj$$'] = $$obj$$;

    merge($$src$$, $$src$$['$$obj$$'])


    return $$src$$;

}

module.exports = parse;

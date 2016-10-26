var string = require('./string');
var convert = require('./convert');

function parse($$file$$, $$mrg$$) {

    var $$src$$ = eval(convert($$file$$));

    if ($$mrg$$) {
        $$src$$.$$mrg$$ = $$mrg$$;
    }

    return $$src$$;

}

module.exports = parse;

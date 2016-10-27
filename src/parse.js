var string = require('./string');
var convert = require('./convert');

function parse($$file$$, $$mrg$$, $$opts$$) {

    var $$src$$ = eval(convert($$file$$, $$opts$$));

    if ($$mrg$$) {
        $$src$$.$$mrg$$ = $$mrg$$;
    }

    return $$src$$;

}

module.exports = parse;

var string = require('./string');
var convert = require('./convert');

function parse($$file$$, $$mrg$$, $$opts$$) {

    try {
        var $$cnv$$ = convert($$file$$, $$opts$$);
        var $$src$$ = eval($$cnv$$);
    } catch (e) {
        e.file = $$file$$
        throw e
    }
    if ($$mrg$$) {
        $$src$$.$$mrg$$ = $$mrg$$;
    }

    return $$src$$;

}

module.exports = parse;

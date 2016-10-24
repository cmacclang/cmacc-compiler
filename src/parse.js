var string = require('./string');
var convert = require('./convert');

function parse($$file$$, $$mrg$$) {

    var $$src$$ = eval(convert($$file$$));

    if($$mrg$$) {
        $$src$$.$$mrg$$ = $$mrg$$;
    }

   // console.log(JSON.stringify($$src$$, null, 4));

    return $$src$$;

}

module.exports = parse;

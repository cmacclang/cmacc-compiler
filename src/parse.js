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

    //TODO: Hack for file path windows
    if(/^win/.test(process.platform) ){
        if($$src$$.$$text$$){
            $$src$$.$$text$$ = $$src$$.$$text$$.replace(/^((\r\n)|;)*/yg,'')
        }
        if($$src$$.$$text$$ === '' || $$src$$.$$text$$ === null){
            delete $$src$$.$$text$$
        }
    }

    return $$src$$;

}

module.exports = parse;

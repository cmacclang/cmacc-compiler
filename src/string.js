var ier = 0
function string($$str$$) {

    if(typeof $$str$$ !== 'object') {

        return new function str(){
            ier++;
            this.$$i$$ = ier
            this.$$str$$ = $$str$$
        };
    }

    if(typeof $$str$$ === 'object'){
        for (var i in $$str$$) {
            if(!i.match(/\$\$(.*\$\$)/)){
                $$str$$[i] = string($$str$$[i])
            }else{
                $$str$$[i] = $$str$$[i]
            }
        }
        return $$str$$;
    }



}

module.exports = string;

function string($$str$$, $$obj$$) {

    if(typeof $$str$$ !== 'object') {
        return new function str(){
            this.$$str$$ = $$str$$
            this.$$obj$$ = $$obj$$
        };
    }

    if(typeof $$str$$ === 'object'){
        for (var i in $$str$$) {
            if(!i.match(/\$\$(.*\$\$)/)){
                $$str$$[i] = string($$str$$[i], $$obj$$)
            }else{
                $$str$$[i] = $$str$$[i]
            }
        }
        return $$str$$;
    }

}

module.exports = string;

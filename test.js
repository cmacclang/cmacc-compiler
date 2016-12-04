var $$obj$$ = {};

var content = parse("https://raw.githubusercontent.com/mdangear/cmacctest/master/Form/HelloWorld.cmacc");;
$$obj$$.content =  content ;

$$obj$$.$$text$$ = "{{content}}";
$$obj$$.$$file$$ = "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/GitHub.cmacc";

module.exports = $$obj$$;

var $$obj$$ = {};
var person = parse("https://raw.githubusercontent.com/mdangear/cmacctest/master/ID/_person.cmacc", string({}, $$obj$$));;

var name_Full = parse("https://raw.githubusercontent.com/mdangear/cmacctest/master/ID/_person_full.cmacc", string({
    "person" : person
}

{{person.gender.His_Her}} name is {{name_Full}} and {{person.gender.he_she}} lives in {{person.city}}


, $$obj$$));;

$$obj$$.person =  person ; $$obj$$.name_Full =  name_Full ; $$obj$$.$$file$$ = "https://raw.githubusercontent.com/mdangear/cmacctest/master/Form/HelloWorld.cmacc";module.exports = $$obj$$;

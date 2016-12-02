$hello;

$hello=null;

$hello="";

$hello="World";

$hello=hello.world;

$obj={
    "hello" : "World"
};

$imp=[./doc.md];

$imp_over=[./doc.md]=>{
    "hello" : "World"
};

$imp_over_obj=[./doc.md]=>{
    "hello" : {
        "hello" : "World"
    }
};

$imp_over_obj = [http://cmacc.com/doc.md] => {
    "hello" : {
        "hello" : "World"
    }
};

$imp_over_obj = [http://cmacc.com/test%20-%20test/doc.md] => {
    "hello" : {
        "hello" : "World"
    }
};

{{obj}}
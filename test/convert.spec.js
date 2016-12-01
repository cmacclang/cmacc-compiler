var assert = require('assert');

var fs = require('fs');
var path = require('path');

var dir = 'file://' + __dirname;

var marked = require('marked');

var cmacc = require('../src/index');
var convert = cmacc.convert;

describe('Convert', function () {

    describe('Comment', function () {
        describe('CommentSlash.cmacc', function () {
            it('should convert CommentSlash.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'CommentSlash.cmacc');
                var result = convert('file://' + file);
                assert.equal(result, 'var $$obj$$ = {};var world = string(\"World\", $$obj$$);;\n\n$$obj$$.world =  world ; $$obj$$.$$text$$ = \"Hello {{world}}\\n\";$$obj$$.$$file$$ = \"file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/CommentSlash.cmacc\";module.exports = $$obj$$;');
                done()
            });
        });
    });

    describe('Variable', function () {
        describe('Variable.cmacc', function () {
            it('should convert Variable.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'Variable.cmacc');
                var result = convert('file://' + file);
                assert.equal(result, 'var $$obj$$ = {};var hello1 = string(\"World1\", $$obj$$);;\n\n$$obj$$.hello1 =  hello1 ; $$obj$$.$$file$$ = \"file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/Variable.cmacc\";module.exports = $$obj$$;');
                done()
            });
        });

        describe('Object.cmacc', function () {
            it('should convert Object.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'Object.cmacc');
                var result = convert('file://' + file);
                log(result);
                assert.equal(result, 'var $$obj$$ = {};var str = string(\"Lala\", $$obj$$);;\n\nvar obj1 = string({\n    \"hello1\" : str\n}\n, $$obj$$);;\n\n$$obj$$.str =  str ; $$obj$$.obj1 =  obj1 ; $$obj$$.$$file$$ = \"file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/Object.cmacc\";module.exports = $$obj$$;')
                done();
            });
        });

        describe('ObjectNested.md', function () {
            it('should convert ObjectNested.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'ObjectNested.cmacc');
                var result = convert('file://' + file);
                log(result);
                assert.equal(result, 'var $$obj$$ = {};var str = string(\"Lala\", $$obj$$);;\n\nvar obj1 = string({\n    \"hello1\" : {\n        \"str\": str\n    }\n}\n, $$obj$$);;\n\n$$obj$$.str =  str ; $$obj$$.obj1 =  obj1 ; $$obj$$.$$file$$ = \"file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/ObjectNested.cmacc\";module.exports = $$obj$$;');
                done()
            });
        });
    });

    describe('and import', function () {
        it('should convert ImportFile.cmacc', function (done) {
            var file = 'ImportFile.cmacc';
            var shouldBe = 'var $$obj$$ = {};var obj = parse(\"file:///User/name/test.cmacc\");;\n\n$$obj$$.obj =  obj ; $$obj$$.$$file$$ = \"file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/ImportFile.cmacc\";module.exports = $$obj$$;';
            importAndConvert(done, file, shouldBe);
        });

        it('should convert ImportHttp.cmacc', function (done) {
            var file = 'ImportHttp.cmacc';
            var shouldBe = 'var $$obj$$ = {};var obj = parse(\"http://test.nl/test.cmacc\");;\n\n$$obj$$.obj =  obj ; $$obj$$.$$file$$ = \"file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/ImportHttp.cmacc\";module.exports = $$obj$$;';
            importAndConvert(done, file, shouldBe);
        });

        it('should convert ImportRel.cmacc', function (done) {
            var file = 'ImportRel.cmacc';
            var shouldBe = 'var $$obj$$ = {};var obj = parse(\"file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/Test.md\");;\n\n$$obj$$.obj =  obj ; $$obj$$.$$file$$ = \"file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/ImportRel.cmacc\";module.exports = $$obj$$;';
            importAndConvert(done, file, shouldBe);

        });
    });

    describe('The interpreter', function () {

        it('should invalidate FileNotFound.cmacc because of a file not found', function (done) {
            var file = path.join(__dirname, 'convert/FileNotFound.cmacc');
            var shouldBe = 'ENOENT: no such file or directory, open \'' + file + '\'';
            testInvalidFile(done, file, shouldBe);
        });

    });

    describe('Set variable', function () {

        it('should set variable', function (done) {
            var file = path.join(__dirname, 'convert/SetVar.cmacc');
            var result = convert('file://' + file);
            console.log(result)
            var expect = 'var $$obj$$ = {};var obj2 = parse(\"file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/VariableObject.cmacc\");;\n\nobj2.hello1 = string(\"Test\", $$obj$$);;\n\n$$obj$$.obj2 =  obj2 ; $$obj$$.$$file$$ = \"file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/SetVar.cmacc\";module.exports = $$obj$$;'
            assert.equal(result, expect);
            done()
        });

    });
});

//helper functions:
function importAndConvert(done, file, shouldBe) {
    file = path.join(__dirname, 'convert', file);
    var result = convert('file://' + file);
    log(result);
    assert.equal(result, shouldBe);
    done();
}

function testInvalidFile(done, file, assertString) {
    try {
        convert('file://' + file);
    } catch (e) {
        assert.equal(e.message, assertString);
        done();
    }
}

function log(obj) {
    //console.log(JSON.stringify(obj, null, 4));
}
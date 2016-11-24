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
                assert.equal(result, 'var world = string(\"World\");;\n\nmodule.exports = {\tworld : world,$$text$$ : \"Hello {{world}}\\n\",$$file$$ : \"file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/CommentSlash.cmacc\"};');
                done()
            });
        });
    });

    describe('Variable', function () {
        describe('Variable.cmacc', function () {
            it('should convert Variable.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'Variable.cmacc');
                var result = convert('file://' + file);
                assert.equal(result, 'var hello1 = string(\"World1\");;\n\nmodule.exports = {\thello1 : hello1,$$file$$ : \"' + dir + '/convert/Variable.cmacc\"};');
                done()
            });
        });

        describe('Object.cmacc', function () {
            it('should convert Object.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'Object.cmacc');
                var result = convert('file://' + file);
                log(result);
                assert.equal(result, 'var str = string(\"Lala\");;\n\nvar obj1 = string({\n    \"hello1\" : str\n}\n);;\n\nmodule.exports = {\tstr : str,\tobj1 : obj1,$$file$$ : \"' + dir + '/convert/Object.cmacc\"};')
                done();
            });
        });

        describe('ObjectNested.md', function () {
            it('should convert ObjectNested.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'ObjectNested.cmacc');
                var result = convert('file://' + file);
                log(result);
                assert.equal(result, 'var str = string(\"Lala\");;\n\nvar obj1 = string({\n    \"hello1\" : {\n        \"str\": str\n    }\n}\n);;\n\nmodule.exports = {\tstr : str,\tobj1 : obj1,$$file$$ : \"' + dir + '/convert/ObjectNested.cmacc\"};');
                done()
            });
        });
    });

    describe('and import', function () {
        it('should convert ImportFile.cmacc', function (done) {
            var file = 'ImportFile.cmacc';
            var shouldBe = 'var obj = parse(\"file:///User/name/test.cmacc\");;\n\nmodule.exports = {\tobj : obj,$$file$$ : \"' + dir + '/convert/ImportFile.cmacc\"};';
            importAndConvert(done, file, shouldBe);
        });

        it('should convert ImportHttp.cmacc', function (done) {
            var file = 'ImportHttp.cmacc';
            var shouldBe = 'var obj = parse(\"http://test.nl/test.cmacc\");;\n\nmodule.exports = {\tobj : obj,$$file$$ : \"' + dir + '/convert/ImportHttp.cmacc\"};';
            importAndConvert(done, file, shouldBe);
        });

        it('should convert ImportRel.cmacc', function (done) {
            var file = 'ImportRel.cmacc';
            var shouldBe = 'var obj = parse(\"' + dir + '/convert/Test.md\");;\n\nmodule.exports = {\tobj : obj,$$file$$ : \"' + dir + '/convert/ImportRel.cmacc\"};';
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
            var expect = 'var obj2 = parse("file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/VariableObject.cmacc");;\n\nobj2.hello1 = string("Test");;\n\nmodule.exports = {	obj2 : obj2,$$file$$ : "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/SetVar.cmacc"};'
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
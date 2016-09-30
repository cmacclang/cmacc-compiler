var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

var cmacc = require('../src/index');
var convert = cmacc.convert;

describe('Convert', function () {

    describe('Variable', function () {
        describe('Variable.cmacc', function () {
            it('should convert Variable.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'Variable.cmacc');
                var result = convert(file);
                // log(result);
                assert.equal(result, 'var hello1 = \"World1\";\n\nmodule.exports = {\thello1 : hello1,$$file$$ : \"/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/Variable.cmacc\"};');
                done()
            });
        });

        describe('Object.cmacc', function () {
            it('should convert Object.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'Object.cmacc');
                var result = convert(file);
                log(result);
                assert.equal(result, 'var str = \"Lala\";\n\nvar obj1 = {\n    \"hello1\" : str\n}\n;\n\nmodule.exports = {\tstr : str,\tobj1 : obj1,$$file$$ : \"/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/Object.cmacc\"};');
                done();
            });
        });

        describe('ObjectNested.md', function () {
            it('should convert ObjectNested.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'ObjectNested.cmacc');
                var result = convert(file);
                log(result);
                assert.equal(result, 'var str = \"Lala\";\n\nvar obj1 = {\n    \"hello1\" : {\n        \"str\": str\n    }\n}\n;\n\nmodule.exports = {\tstr : str,\tobj1 : obj1,$$file$$ : \"/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/ObjectNested.cmacc\"};');
                done()
            });
        });
    });

    describe('and import', function () {
        it('should convert ImportFile.cmacc', function (done) {
            var file = 'ImportFile.cmacc';
            var shouldBe = 'var obj = parse(\"file:///User/name/test.cmacc\");\n\nmodule.exports = {\tobj : obj,$$file$$ : \"/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/ImportFile.cmacc\"};';
            importAndConvert(done, file, shouldBe);
        });

        it('should convert ImportHttp.cmacc', function (done) {
            var file = 'ImportHttp.cmacc';
            var shouldBe = 'var obj = parse(\"http://test.nl/test.cmacc\");\n\nmodule.exports = {\tobj : obj,$$file$$ : \"/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/ImportHttp.cmacc\"};';
            importAndConvert(done, file, shouldBe);
        });

        it('should convert ImportRel.cmacc', function (done) {
            var file = 'ImportRel.cmacc';
            var shouldBe = 'var obj = parse(\"/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/Test.md\");\n\nmodule.exports = {\tobj : obj,$$file$$ : \"/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/convert/ImportRel.cmacc\"};';
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
});

//helper functions:
function importAndConvert(done, file, shouldBe) {
    file = path.join(__dirname, 'convert', file);
    var result = convert(file);
    log(result);
    assert.equal(result, shouldBe);
    done();
}

function testInvalidFile(done, file, assertString) {
    try {
        convert(file);
    } catch (e) {
        assert.equal(e.message, assertString);
        done();
    }
}

function log(obj) {
    //console.log(JSON.stringify(obj, null, 4));
}
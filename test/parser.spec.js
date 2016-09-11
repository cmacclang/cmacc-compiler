var assert = require('assert');

var fs = require('fs');
var path = require('path');

describe('regex', function () {

    var parser = require('../src/parser');

    describe('RegexVariable.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(__dirname, 'regex', 'RegexVariable.md');
            parser("file://" + file, function (err, doc) {

                console.log(doc);

                assert.equal(doc.variables[0].key, 'hello');
                assert.equal(doc.variables[0].val, undefined);

                assert.equal(doc.variables[6].key, 'imp_over_obj');
                assert.equal(doc.variables[6].ref, './doc.md');
                assert.equal(doc.variables[6].val, '{\n    "hello" : {\n        "hello" : "World"\n    }\n}\n');

                assert.equal(doc.text, '{{obj}}\n');
                done();

            });
        });
    });


    describe('Comment.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(__dirname, 'regex', 'Comment.cmacc');
            parser("file://" + file, function (err, doc) {

                console.log(doc);

                assert.equal(doc.variables[0].key, 'hello');
                assert.equal(doc.variables[0].val, '"Test"');

                assert.equal(doc.text, '{{hello}}\n');
                done();

            });
        });
    });

});
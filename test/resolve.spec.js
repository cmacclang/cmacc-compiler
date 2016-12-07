var assert = require('assert');

var fs = require('fs');
var path = require('path');
var marked = require('marked');

describe('resolve', function () {

    var cmacc = require('../src/index');

    var compile = cmacc.compile;
    var resolve = cmacc.resolve;

    var run = function (file) {
        var ast = compile('file://' + file);
        var result = resolve(ast);
        return result;
    };

    describe('run', function () {

        describe('HelloWorld.cmacc', function () {
            it('should parse HelloWorld.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'HelloWorld.cmacc');
                var result = run(file);

                assert.equal(result, "Hello World");

                done()
            });
        });

        describe('SubInVar.cmacc', function () {
            it('should parse SubInVar.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'SubInVar.cmacc');
                var result = run(file);

                assert.equal(result, "Hello World");

                done()
            });
        });

        describe('SubInObj.cmacc', function () {
            it('should parse SubInObj.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'SubInObj.cmacc');
                var result = run(file);

                assert.equal(result, "Hello World");

                done()
            });
        });

        describe('Object.cmacc', function () {
            it('should parse Object.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'Object.cmacc');
                var result = run(file);

                assert.equal(result, "Hello World");

                done()
            });
        });

        describe('Import.cmacc', function () {
            it('should parse Import.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'Import.cmacc');
                var result = run(file);

                assert.equal(result, "Hello World\n\nText");

                done()
            });
        });
    });

    describe('space', function () {

        describe('SpaceList.cmacc', function () {
            it('should resovle SpaceList.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'SpaceList.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast);

                var lines = result.split(/\n/);

                assert.equal(lines[0], '1. Item 1');
                assert.equal(lines[1], '2. Hello World');
                assert.equal(lines[2], '   1. SpaceItem 1');
                assert.equal(lines[3], '   2. SpaceItem 2');

                done();
            });
        });

        describe('SpaceList2.cmacc', function () {
            it('should resovle SpaceList.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'SpaceList2.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast);

                var lines = result.split(/\n/);

                assert.equal(lines[0], '1. Item 1');
                assert.equal(lines[1], '2. Test');
                assert.equal(lines[2], '  1. Hello World');
                assert.equal(lines[3], '  2. Piet');


                //console.log(marked(result))

                done();
            });
        });

        describe('SpaceList.cmacc debug', function () {
            it('should resovle SpaceList.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'SpaceList.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast, {debug: true});

                var lines = result.split(/\n/);

                assert.equal(lines[0], '1. Item 1');
                assert.equal(lines[1], '2. <cmacc-variable name="item">Hello World</cmacc-variable>');
                assert.equal(lines[2], '   1. <cmacc-variable name="item">SpaceItem 1</cmacc-variable>');
                assert.equal(lines[3], '   2. <cmacc-variable name="item">SpaceItem 2</cmacc-variable>');

                done();
            });
        });
    });

    describe('debug', function () {

        describe('HelloWorld.cmacc', function () {
            it('should parse HelloWorld.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'HelloWorld.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast, {debug: true});

                assert.equal(result, '<cmacc-variable name="hello">Hello</cmacc-variable> World');

                done();
            });
        });

        describe('Object.cmacc', function () {
            it('should parse Object.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'Object.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast, {debug: true});

                assert.equal(result, '<cmacc-variable name="obj.hello">Hello</cmacc-variable> <cmacc-variable name="obj.world">World</cmacc-variable>');

                done()
            });
        });

    });

    describe('missing', function () {

        describe('MissingVar.cmacc', function () {
            it('should parse MissingVar.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'MissingVar.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast);

                assert.equal(result, 'Hello !!hello!!');

                done();
            });
        });

    });

    describe('empty', function () {

        describe('EmptyString.cmacc', function () {
            it('should parse EmptyString.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'EmptyString.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast);

                assert.equal(result, 'Hello ');

                done();
            });
        });

        describe('EmptyStringImport.cmacc', function () {
            it('should parse EmptyStringImport.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'EmptyStringImport.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast);

                assert.equal(result, 'Hello ');

                done();
            });
        });

        describe('EmptyStringImportOverwrite.cmacc', function () {
            it('should parse EmptyStringImportOverwrite.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'EmptyStringImportOverwrite.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast);

                assert.equal(result, 'Hello ---');
                done();
            });
        });

        describe('EmptyStringOverwrite.cmacc', function () {
            it('should parse EmptyStringOverwrite.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'EmptyStringOverwrite.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast);

                assert.equal(result, 'Hello _');
                done();
            });
        });

        describe('EmptyStringOverwriteEmpty.cmacc', function () {
            it('should parse EmptyStringOverwriteEmpty.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'EmptyStringOverwriteEmpty.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast);

                assert.equal(result, 'Hello ');
                done();
            });
        });

    });

    describe('overload', function () {

        describe('OverloadVariable.cmacc', function () {
            it('should parse OverloadVariable.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'OverloadVariable.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast);

                assert.equal(result, 'World1');

                done();
            });
        });

    });

    describe('DefinedOptionsUse', function () {

        describe('DefinedOptionsUse.cmacc', function () {
            it('should parse DefinedOptionsUse.cmacc', function (done) {
                var file = path.join(__dirname, 'resolve', 'DefinedOptionsUse.cmacc');
                var ast = compile('file://' + file);
                var result = resolve(ast);

                assert.equal(result, 'by a Party (the Disclosing Party) to the other Party (the Receiving_Party)');

                done();
            });
        });

    });
});
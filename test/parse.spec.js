var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('parse', function () {

    var cmacc = require('../src/index');
    var parse = cmacc.parse;

    describe('Variable', function () {

        describe('VariableEmpty.cmacc', function () {
            it('should parse VariableEmpty.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'VariableEmpty.cmacc');

                var result = parse(file);
                assert.equal(result.hello1, null);
                done()
            });
        });

        describe('VariableNull.cmacc', function () {
            it('should parse VariableNull.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'VariableNull.cmacc');

                var result = parse(file);
                assert.equal(result.hello1, null);

                done()
            });
        });

        describe('VariableString.cmacc', function () {
            it('should parse VariableString.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'VariableString.cmacc');

                var result = parse(file);
                assert.equal(result.hello1.$$str$$, 'World1');

                done()
            });
        });

        describe('VariableObject.cmacc', function () {
            it('should parse VariableObject.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'VariableObject.cmacc');

                var result = parse(file);
                assert.equal(result.hello1.hello1.$$str$$, 'World1');

                done()
            });
        });

    });

    describe('Import', function () {

        describe('ImportObject.cmacc', function () {
            it('should parse ImportObject.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObject.cmacc');

                var result = parse(file);

                assert.equal(result.obj2.hello1.hello1.$$str$$, 'World1');
                done()
            });
        });

        describe('ImportObjectOverwrite.cmacc', function () {
            it('should parse ImportObjectOverwrite.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObjectOverwrite.cmacc');

                var result = parse(file);

                assert.equal(result.obj2.hello1.hello1.$$str$$, 'World1');
                assert.equal(result.obj2.$$mrg$$.obj1.hello1.$$str$$, 'World2');
                done()
            });
        });

        describe('ImportObjectSubstitutionImport.cmacc', function () {
            it('should parse ImportObjectSubstitutionImport.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImport.cmacc');

                var result = parse(file);

                assert.equal(result.obj3.hello1.hello1.$$str$$, 'World1');
                assert.equal(result.obj3.$$mrg$$.obj1.hello1.$$str$$, 'World3');
                assert.equal(result.obj2.hello1.$$str$$, 'World1');
                assert.equal(result.obj2.$$mrg$$.hello1.hello1.hello1.$$str$$, 'World1');

                done()
            });
        });

        describe('ImportObjectSubstitutionImportDouble.cmacc', function () {
            it('should parse ImportObjectSubstitutionImportDouble.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImportDouble.cmacc');

                var result = parse(file);

                assert.equal(result.obj3.obj3.hello1.hello1.$$str$$, 'World1');

                done()
            });
        });
    });

    describe('Change', function () {
        describe('ImportObject.cmacc', function () {
            it('should parse ImportObject.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObject.cmacc');

                var result = parse(file);

                result.obj2.hello1 = 'World5';

                assert.equal(result.obj2.hello1, 'World5');

                done()
            });
        });
    });

    xdescribe('Merge', function () {

        describe('MergeSimple.cmacc', function () {
            it('should parse MergeSimple.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeSimple.cmacc');

                var result = parse(file);

                assert.equal(result.obj.hello2, 'World1');
                assert.equal(result.obj.hello1.hello1, 'World1');
                done()
            });
        });

        describe('MergeDepth.cmacc', function () {
            it('should parse MergeDepth.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeDepth.cmacc');

                var result = parse(file);

                assert.equal(result.obj.hello1.hello2, 'World2');
                done()
            });
        });

        describe('MergeOverwrite.cmacc', function () {
            it('should parse MergeOverwrite.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeOverwrite.cmacc');

                var result = parse(file);

                assert.equal(result.obj.hello1.hello1, 'World2');
                done()
            });
        });
    });

    describe('Merge', function () {

        describe('MergeSimple.cmacc', function () {
            it('should parse MergeSimple.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeSimple.cmacc');

                var result = parse(file);

                console.log(JSON.stringify(result, null, 4));

                assert.deepEqual(result, {
                    "obj": {
                        "hello1": {
                            "hello1": {
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                        "$$mrg$$": {
                            "hello2": {
                                "$$str$$": "World1"
                            }
                        }
                    },
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/MergeSimple.cmacc"
                });

                done();

            });
        });

        describe('MergeDepth.cmacc', function () {
            it('should parse MergeDepth.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeDepth.cmacc');

                var result = parse(file);

                console.log(JSON.stringify(result, null, 4));

                assert.deepEqual(result, {
                    "obj": {
                        "hello1": {
                            "hello1": {
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                        "$$mrg$$": {
                            "hello1": {
                                "hello2": {
                                    "$$str$$": "World2"
                                }
                            }
                        }
                    },
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/MergeDepth.cmacc"
                });

                done();

            });
        });

    });

    describe('Text', function () {
        describe('TextSimple.cmacc', function () {
            it('should parse TextSimple.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'TextSimple.cmacc');

                var result = parse(file);

                assert.deepEqual(result, {
                    "test": {
                        "$$str$$": "Hello"
                    },
                    "$$text$$": "{{test}} World",
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/TextSimple.cmacc"
                });

                done();

            });
        });

        describe('TextImport.cmacc', function () {
            it('should parse TextImport.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'TextImport.cmacc');

                var result = parse(file);

                assert.deepEqual(result, {
                    "test": {
                        "test": {
                            "$$str$$": "Hello"
                        },
                        "$$text$$": "{{test}} World",
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/TextSimple.cmacc"
                    },
                    "$$text$$": "{{test}}",
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/TextImport.cmacc"
                });

                done();

            });
        });
    });

    describe('Deep', function () {
        describe('DeeperVars.cmacc', function () {
            it('should parse DeeperVars.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'DeeperVars.cmacc');

                var result = parse(file);

                console.log(JSON.stringify(result, null, 4));

                assert.deepEqual(result, {
                    "obj": {
                        "hello1": {
                            "hello1": {
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc"
                    },
                    "test": {
                        "test": {
                            "$$str$$": "World1"
                        }
                    },
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/DeeperVars.cmacc"
                });
                done();
            });
        });

    });

    describe('Set', function () {
        describe('SetVariable.cmacc', function () {
            xit('should parse SetVariable.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'SetVariable.cmacc');

                var result = parse(file);

                assert.equal(result.test.test, 'World1');
                assert.equal(result.obj.hello1.hello1, 'World1');
                done()
            });
        });

    });

});
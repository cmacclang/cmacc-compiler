var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('compile', function () {

    var cmacc = require('../src/index');
    var parse = cmacc.parse;
    var compile = cmacc.compile;


    describe('Import', function () {

        describe('ImportObjectSubstitutionImport.cmacc', function () {
            it('should compile ImportObjectSubstitutionImport.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImport.cmacc');

                var result = parse(file);

                result.obj3.obj1 = {}
                result.obj3.obj1.hello1 = result.obj3.$$mrg$$.obj1.hello1

                delete result.obj3.$$mrg$$

                result.obj2.hello1 = result.obj2.$$mrg$$.hello1

                delete result.obj2.$$mrg$$

                //result.obj3.obj1.hello1.$$str$$ = 123;
                //result.obj3.hello1.hello1.$$str$$ = 456;

                //result.obj3.hello1.hello1 = obj3.$$mrg$$.obj1

                console.log(JSON.stringify(result, null, 4));

                assert.deepEqual(result, {
                    "obj3": {
                        "hello1": {
                            "hello1": {
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                        "obj1": {
                            "hello1": {
                                "$$str$$": "World3"
                            }
                        }
                    },
                    "obj2": {
                        "hello1": {
                            "hello1": {
                                "hello1": {
                                    "$$str$$": "World1"
                                }
                            },
                            "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                            "obj1": {
                                "hello1": {
                                    "$$str$$": "World3"
                                }
                            }
                        },
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableString.cmacc"
                    },
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/ImportObjectSubstitutionImport.cmacc"
                });
            });





            it('should compile ImportObjectSubstitutionImport.cmacc 1', function () {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImport.cmacc');

                var result = compile(file);


                console.log(JSON.stringify(result, null, 4));

                assert.deepEqual(result, {
                    "obj3": {
                        "hello1": {
                            "hello1": {
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                        "obj1": {
                            "hello1": {
                                "$$str$$": "World3"
                            }
                        }
                    },
                    "obj2": {
                        "hello1": {
                            "hello1": {
                                "hello1": {
                                    "$$str$$": "World1"
                                }
                            },
                            "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                            "obj1": {
                                "hello1": {
                                    "$$str$$": "World3"
                                }
                            }
                        },
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableString.cmacc"
                    },
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/ImportObjectSubstitutionImport.cmacc"
                });
            });
        });
    });

    describe('parameters_across_multiple_files draft1', function () {
        it('should parse parameters_across_multiple_files/draft1.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './parameters_across_multiple_files/draft1.cmacc');
            var result = compile(file);
            console.log(JSON.stringify(result, null, 4));
            assert.deepEqual(result,{})
            done()

        });
    });
});
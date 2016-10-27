var assert = require('assert');

var fs = require('fs');
var path = require('path');

var dir = 'file://' + __dirname;

var marked = require('marked');

describe('compile', function () {

    var cmacc = require('../src/index');
    var parse = cmacc.parse;
    var compile = cmacc.compile;


    describe('Import', function () {

        describe('ImportObjectSubstitutionImport.cmacc', function () {
            it('should compile ImportObjectSubstitutionImport.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImport.cmacc');

                var result = parse('file://' + file);

                result.obj3.obj1 = {}
                result.obj3.obj1.hello1 = result.obj3.$$mrg$$.obj1.hello1

                delete result.obj3.$$mrg$$

                result.obj2.hello1 = result.obj2.$$mrg$$.hello1

                delete result.obj2.$$mrg$$

                assert.deepEqual(result, {
                    "obj3": {
                        "hello1": {
                            "hello1": {
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": dir + "/parse/VariableObject.cmacc",
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
                            "$$file$$": dir + "/parse/VariableObject.cmacc",
                            "obj1": {
                                "hello1": {
                                    "$$str$$": "World3"
                                }
                            }
                        },
                        "$$file$$": dir + "/parse/VariableString.cmacc"
                    },
                    "$$file$$": dir + "/parse/ImportObjectSubstitutionImport.cmacc"
                });
            });


            xit('should compile ImportObjectSubstitutionImport.cmacc 1', function () {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImport.cmacc');

                var result = compile(file);

                assert.deepEqual(result, {
                    "obj3": {
                        "hello1": {
                            "hello1": {
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": dir + "/parse/VariableObject.cmacc",
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
                            "$$file$$": dir + "/parse/VariableObject.cmacc",
                            "obj1": {
                                "hello1": {
                                    "$$str$$": "World3"
                                }
                            }
                        },
                        "$$file$$": dir + "/parse/VariableString.cmacc"
                    },
                    "$$file$$": dir + "/parse/ImportObjectSubstitutionImport.cmacc"
                });
            });
        });
    });

    describe('parameters_across_multiple_files draft1', function () {
        it('should parse parameters_across_multiple_files/draft1.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './parameters_across_multiple_files/draft1.cmacc');
            var result = compile('file://' + file);

            assert.deepEqual(result.party1, {
                "name_First": {
                    "$$str$$": "Marc"
                },
                "name_Last": {
                    "$$str$$": "Dangeard"
                },
                "name_Full": {
                    "$$str$$": "{{name_First}} {{name_Last}}"
                },
                "city": {
                    "$$str$$": "Paris"
                },
                "gender": {
                    "he_she": {
                        "$$str$$": "he"
                    },
                    "his_her": {
                        "$$str$$": "his"
                    },
                    "He_She": {
                        "$$str$$": "He"
                    },
                    "His_Her": {
                        "$$str$$": "His"
                    },
                    "$$file$$": dir + "/case/parameters_across_multiple_files/he.cmacc"
                },
                "pron": {
                    "meus": {
                        "$$str$$": "me"
                    },
                    "Iwe": {
                        "$$str$$": "I"
                    },
                    "myour": {
                        "$$str$$": "my"
                    },
                    "IWe": {
                        "$$str$$": "I"
                    },
                    "MyOur": {
                        "$$str$$": "My"
                    },
                    "$$file$$": dir + "/case/parameters_across_multiple_files/_sing.cmacc"
                },
                "$$file$$": dir + "/case/parameters_across_multiple_files/MarcDangeard.cmacc"
            })
            done()

        });
    });
});
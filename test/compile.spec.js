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

                assert.deepEqual(result.obj3.hello1.hello1.$$obj$$, result.obj3);
                assert.deepEqual(result.obj3.obj1.hello1.$$obj$$, result);
                assert.deepEqual(result.obj2.hello1.hello1.hello1.$$obj$$, result.obj3);
                assert.deepEqual(result.obj2.hello1.obj1.hello1.$$obj$$, result);

                assert.deepEqual(result, {
                    "obj3": {
                        "hello1": {
                            "hello1": {
                                $$obj$$: result.obj3,
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": dir + "/parse/VariableObject.cmacc",
                        "obj1": {
                            "hello1": {
                                $$obj$$: result,
                                "$$str$$": "World3"
                            }
                        }
                    },
                    "obj2": {
                        "hello1": {
                            "hello1": {
                                "hello1": {
                                    $$obj$$: result.obj3,
                                    "$$str$$": "World1"
                                }
                            },
                            "$$file$$": dir + "/parse/VariableObject.cmacc",
                            "obj1": {
                                "hello1": {
                                    $$obj$$: result,
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
                                $$obj$$: result.obj3,
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": dir + "/parse/VariableObject.cmacc",
                        "obj1": {
                            "hello1": {
                                $$obj$$: result,
                                "$$str$$": "World3"
                            }
                        }
                    },
                    "obj2": {
                        "hello1": {
                            "hello1": {
                                "hello1": {
                                    $$obj$$: result.obj3,
                                    "$$str$$": "World1"
                                }
                            },
                            "$$file$$": dir + "/parse/VariableObject.cmacc",
                            "obj1": {
                                "hello1": {
                                    $$obj$$: result,
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

            assert.deepEqual(result.party1, result.party1);
            assert.deepEqual(result.party1.city.$$obj$$, result.party1);

            assert.deepEqual(result.party1, {
                "name_First": {
                    $$obj$$: result.party1,
                    "$$str$$": "Marc"
                },
                "name_Last": {
                    $$obj$$: result.party1,
                    "$$str$$": "Dangeard"
                },
                "name_Full": {
                    $$obj$$: result.party1,
                    "$$str$$": "{{name_First}} {{name_Last}}"
                },
                "city": {
                    $$obj$$: result.party1,
                    "$$str$$": "Paris"
                },
                "gender": {
                    "he_she": {
                        $$obj$$: result.party1.gender,
                        "$$str$$": "he"
                    },
                    "his_her": {
                        $$obj$$: result.party1.gender,
                        "$$str$$": "his"
                    },
                    "He_She": {
                        $$obj$$: result.party1.gender,
                        "$$str$$": "He"
                    },
                    "His_Her": {
                        $$obj$$: result.party1.gender,
                        "$$str$$": "His"
                    },
                    "$$file$$": dir + "/case/parameters_across_multiple_files/he.cmacc"
                },
                "pron": {
                    "meus": {
                        $$obj$$: result.party1.pron,
                        "$$str$$": "me"
                    },
                    "Iwe": {
                        $$obj$$: result.party1.pron,
                        "$$str$$": "I"
                    },
                    "myour": {
                        $$obj$$: result.party1.pron,
                        "$$str$$": "my"
                    },
                    "IWe": {
                        $$obj$$: result.party1.pron,
                        "$$str$$": "I"
                    },
                    "MyOur": {
                        $$obj$$: result.party1.pron,
                        "$$str$$": "My"
                    },
                    "$$file$$": dir + "/case/parameters_across_multiple_files/_sing.cmacc"
                },
                "$$file$$": dir + "/case/parameters_across_multiple_files/MarcDangeard.cmacc"
            });
            done()

        });
    });
});
var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

var dir = 'file://' + __dirname;

describe('parse', function () {

    var cmacc = require('../src/index');
    var parse = cmacc.parse;

    describe('Text', function () {
        describe('TextOnly.cmacc', function () {
            it('should parse TextOnly.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'TextOnly.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    '$$text$$': 'Hello World',
                    "$$file$$": dir + "/parse/TextOnly.cmacc"
                });
            });
        });
    });


    describe('Variable', function () {

        describe('VariableEmpty.cmacc', function () {
            it('should parse VariableEmpty.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'VariableEmpty.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "hello1": null,
                    "$$file$$": dir + "/parse/VariableEmpty.cmacc"
                });
            });
        });

        describe('VariableNull.cmacc', function () {
            it('should parse VariableNull.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'VariableNull.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "hello1": null,
                    "$$file$$": dir + "/parse/VariableNull.cmacc"
                });
            });
        });

        describe('VariableString.cmacc', function () {
            it('should parse VariableString.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'VariableString.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "hello1": {
                        "$$obj$$": result,
                        "$$str$$": "World1"
                    },
                    "$$file$$": dir + "/parse/VariableString.cmacc"
                });
            });
        });

        describe('VariableObject.cmacc', function () {
            it('should parse VariableObject.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'VariableObject.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "hello1": {
                        "hello1": {
                            "$$obj$$": result,
                            "$$str$$": "World1"
                        }
                    },
                    "$$file$$": dir + "/parse/VariableObject.cmacc"
                });
            });
        });
    });

    describe('Import', function () {

        describe('ImportObject.cmacc', function () {
            it('should parse ImportObject.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'ImportObject.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "obj2": {
                        "hello1": {
                            "hello1": {
                                "$$obj$$": result.obj2,
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": dir + "/parse/VariableObject.cmacc"
                    },
                    "$$file$$": dir + "/parse/ImportObject.cmacc"
                });
            });
        });

        describe('ImportObjectOverwrite.cmacc', function () {
            it('should parse ImportObjectOverwrite.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'ImportObjectOverwrite.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "obj2": {
                        "hello1": {
                            "hello1": {
                                "$$obj$$": result.obj2,
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": dir + "/parse/VariableObject.cmacc",
                        "$$mrg$$": {
                            "obj1": {
                                "hello1": {
                                    "$$obj$$": result,
                                    "$$str$$": "World2"
                                }
                            }
                        }
                    },
                    "$$file$$": dir + "/parse/ImportObjectOverwrite.cmacc"
                });
            });
        });

        describe('ImportObjectSubstitutionImport.cmacc', function () {
            it('should parse ImportObjectSubstitutionImport.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImport.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result.obj3.hello1.hello1.$$obj$$, result.obj3);
                assert.deepEqual(result.obj3.$$mrg$$.obj1.hello1.$$obj$$, result);
                assert.deepEqual(result.obj2.$$mrg$$.hello1.hello1.hello1.$$obj$$, result.obj3);
                assert.deepEqual(result.obj2.hello1.$$obj$$, result.obj2);
                assert.deepEqual(result.obj2.$$mrg$$.hello1.$$mrg$$.obj1.hello1.$$obj$$, result);

                assert.deepEqual(result, {
                    "obj3": {
                        "hello1": {
                            "hello1": {
                                "$$obj$$": result.obj3,
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": dir + "/parse/VariableObject.cmacc",
                        "$$mrg$$": {
                            "obj1": {
                                "hello1": {
                                    "$$obj$$": result,
                                    "$$str$$": "World3"
                                }
                            }
                        }
                    },
                    "obj2": {
                        "hello1": {
                            "$$obj$$": result.obj2,
                            "$$str$$": "World1"
                        },
                        "$$file$$": dir + "/parse/VariableString.cmacc",
                        "$$mrg$$": {
                            "hello1": {
                                "hello1": {
                                    "hello1": {
                                        "$$obj$$": result.obj3,
                                        "$$str$$": "World1"
                                    }
                                },
                                "$$file$$": dir + "/parse/VariableObject.cmacc",
                                "$$mrg$$": {
                                    "obj1": {
                                        "hello1": {
                                            "$$obj$$": result,
                                            "$$str$$": "World3"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "$$file$$": dir + "/parse/ImportObjectSubstitutionImport.cmacc"
                });
            });
        });

        describe('ImportObjectSubstitutionImportDouble.cmacc', function () {
            it('should parse ImportObjectSubstitutionImportDouble.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImportDouble.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result.obj3.obj3.hello1.hello1.$$obj$$, result.obj3.obj3);
                assert.deepEqual(result.obj3.obj3.$$mrg$$.obj1.hello1.$$obj$$, result.obj3);
                assert.deepEqual(result.obj3.obj2.$$mrg$$.hello1.hello1.hello1.$$obj$$, result.obj3.obj3);
                assert.deepEqual(result.obj3.obj2.hello1.$$obj$$, result.obj3.obj2);
                assert.deepEqual(result.obj3.obj2.$$mrg$$.hello1.$$mrg$$.obj1.hello1.$$obj$$, result.obj3);

                assert.deepEqual(result, {
                    "obj3": {
                        "obj3": {
                            "hello1": {
                                "hello1": {
                                    "$$obj$$": result.obj3.obj3,
                                    "$$str$$": "World1"
                                }
                            },
                            "$$file$$": dir + "/parse/VariableObject.cmacc",
                            "$$mrg$$": {
                                "obj1": {
                                    "hello1": {
                                        "$$obj$$": result.obj3,
                                        "$$str$$": "World3"
                                    }
                                }
                            }
                        },
                        "obj2": {
                            "hello1": {
                                "$$obj$$": result.obj3.obj2,
                                "$$str$$": "World1"
                            },
                            "$$file$$": dir + "/parse/VariableString.cmacc",
                            "$$mrg$$": {
                                "hello1": {
                                    "hello1": {
                                        "hello1": {
                                            "$$obj$$": result.obj3.obj3,
                                            "$$str$$": "World1"
                                        }
                                    },
                                    "$$file$$": dir + "/parse/VariableObject.cmacc",
                                    "$$mrg$$": {
                                        "obj1": {
                                            "hello1": {
                                                "$$obj$$": result.obj3,
                                                "$$str$$": "World3"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "$$file$$": dir + "/parse/ImportObjectSubstitutionImport.cmacc",
                        "$$mrg$$": {
                            "obj2": {
                                "obj1": {
                                    "hello1": {
                                        "$$obj$$": result,
                                        "$$str$$": "World3"
                                    }
                                }
                            }
                        }
                    },
                    "$$text$$": "{{obj}}",
                    "$$file$$": dir + "/parse/ImportObjectSubstitutionImportDouble.cmacc"
                });
            });
        });
    });

    describe('Merge', function () {

        describe('MergeSimple.cmacc', function () {
            it('should parse MergeSimple.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'MergeSimple.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "obj": {
                        "hello1": {
                            "hello1": {
                                "$$obj$$": result.obj,
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": dir + "/parse/VariableObject.cmacc",
                        "$$mrg$$": {
                            "hello2": {
                                "$$obj$$": result,
                                "$$str$$": "World1"
                            }
                        }
                    },
                    "$$file$$": dir + "/parse/MergeSimple.cmacc"
                });
            });
        });

        describe('MergeDepth.cmacc', function () {
            it('should parse MergeDepth.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'MergeDepth.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "obj": {
                        "hello1": {
                            "hello1": {
                                "$$obj$$": result.obj,
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": dir + "/parse/VariableObject.cmacc",
                        "$$mrg$$": {
                            "hello1": {
                                "hello2": {
                                    "$$obj$$": result,
                                    "$$str$$": "World2"
                                }
                            }
                        }
                    },
                    "$$file$$": dir + "/parse/MergeDepth.cmacc"
                });
            });
        });

        describe('MergeOverwrite.cmacc', function () {
            it('should parse MergeOverwrite.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'MergeOverwrite.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "obj": {
                        "hello1": {
                            "hello1": {
                                "$$obj$$": result.obj,
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": dir + "/parse/VariableObject.cmacc",
                        "$$mrg$$": {
                            "hello1": {
                                "hello1": {
                                    "$$obj$$": result,
                                    "$$str$$": "World2"
                                }
                            }
                        }
                    },
                    "$$file$$": dir + "/parse/MergeOverwrite.cmacc"
                });
            });
        });
    });


    describe('Text', function () {
        describe('TextSimple.cmacc', function () {
            it('should parse TextSimple.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'TextSimple.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "test": {
                        "$$obj$$": result,
                        "$$str$$": "Hello"
                    },
                    "$$text$$": "{{test}} World",
                    "$$file$$": dir + "/parse/TextSimple.cmacc"
                });

                done();

            });
        });

        describe('TextImport.cmacc', function () {
            it('should parse TextImport.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'TextImport.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "test": {
                        "test": {
                            "$$obj$$": result.test,
                            "$$str$$": "Hello"
                        },
                        "$$text$$": "{{test}} World",
                        "$$file$$": dir + "/parse/TextSimple.cmacc"
                    },
                    "$$text$$": "{{test}}",
                    "$$file$$": dir + "/parse/TextImport.cmacc"
                });

                done();

            });
        });
    });

    describe('Set', function () {
        describe('SetVariable.cmacc', function () {
            it('should parse DeeperVars.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'SetVariable.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                        "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/SetVariable.cmacc",
                        "obj2": {
                            "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                            "hello1": {
                                "$$obj$$": result,
                                "$$str$$": "Test123"
                            }
                        }
                    }
                );

            });
        });

    });

    describe('Deep', function () {
        describe('DeeperVars.cmacc', function () {
            it('should parse DeeperVars.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'DeeperVars.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "obj": {
                        "hello1": {
                            "hello1": {
                                "$$obj$$": result.obj,
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": dir + "/parse/VariableObject.cmacc"
                    },
                    "test": {
                        "test": {
                            "$$obj$$": result.obj,
                            "$$str$$": "World1"
                        }
                    },
                    "$$file$$": dir + "/parse/DeeperVars.cmacc"
                });

            });
        });

    });

    describe('Empty', function () {
        describe('EmptyString.cmacc', function () {
            it('should parse DeeperVars.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'EmptyString.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/EmptyString.cmacc",
                    "$$text$$": "Hello {{world}}",
                    "world": {
                        "$$obj$$": result,
                        "$$str$$": ""
                    }
                });
            });
        });

        describe('EmptyStringImport.cmacc', function () {
            it('should parse EmptyStringImport.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'EmptyStringImport.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/EmptyStringImport.cmacc",
                    "$$text$$": "Hello {{empty.world}}",
                    "empty": {
                        "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/EmptyString.cmacc",
                        "$$text$$": "Hello {{world}}",
                        "world": {
                            "$$obj$$": result.empty,
                            "$$str$$": ""
                        }
                    }

                });
            });

        });
    });

    describe('Overload variable', function () {
        describe('OverloadVariable.cmacc', function () {
            it('should parse OverloadVariable.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'OverloadVariable.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result, {
                    "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/OverloadVariable.cmacc",
                    "$$text$$": "{{hello}}",
                    "hello": {
                        "$$obj$$": result.obj,
                        "$$str$$": "World1"
                    },
                    "obj": {
                        "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                        "hello1": {
                            "hello1": {
                                "$$obj$$": result.obj,
                                "$$str$$": "World1"
                            }
                        }
                    }
                });
            });
        });
    });

    describe('Defined Options', function () {
        describe('DefinedOptionsUse.cmacc', function () {
            it('should pardefine_Mutualse DefinedOptionsUse.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'DefinedOptionsUse.cmacc');

                var result = parse('file://' + file);

                assert.deepEqual(result.defineOptions.mutual.$$obj$$, result.defineOptions);
                assert.deepEqual(result.defineOptionsTmp.$$mrg$$.text.$$obj$$, result);
                assert.deepEqual(result.defineOptionsTmp.text.$$obj$$, result.defineOptionsTmp);
                assert.deepEqual(result.define_Mutual.$$obj$$, result);

                assert.deepEqual(result, {
                    "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/DefinedOptionsUse.cmacc",
                    "$$text$$": "{{defineOptionsTmp}}",
                    "defineOptions": {
                        "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/DefinedOptions.cmacc",
                        "mutual": {
                            "$$obj$$": result.defineOptions,
                            "$$str$$": "by a Party (the Disclosing Party) to the other Party (the Receiving_Party)"
                        }
                    },
                    "defineOptionsTmp": {
                        "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/DefinedOptionsTmp.cmacc",
                        "$$mrg$$": {
                            "text": {
                                "$$obj$$": result,
                                "$$str$$": "{{defineOptions.mutual}}"
                            }
                        },
                        "$$text$$": "{{text}}",
                        "text": {
                            "$$obj$$": result.defineOptionsTmp,
                            "$$str$$": "test"
                        }
                    },
                    "define_Mutual": {
                        "$$obj$$": result,
                        "$$str$$": "{{defineOptions.mutual}}"
                    }
                });
            });
        });
    });

    describe('Github', function () {
        describe('GitHub.cmacc', function () {
            it('should pardefine_Mutualse GitHub.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'GitHub.cmacc');
                var result = parse('file://' + file);

                assert.deepEqual(result,{
                        "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/GitHub.cmacc",
                        "$$text$$": "{{content}}",
                        "content": {
                            "$$file$$": "https://raw.githubusercontent.com/wilmveel/cmacc-test/master/Form/HelloWorld.cmacc",
                            "$$text$$": "{{person.gender.His_Her}} name is {{person.name_Full}} and {{person.gender.he_she}} lives in {{person.city}}\n",
                            "person": {
                                "$$file$$": "https://raw.githubusercontent.com/wilmveel/cmacc-test/master/ID/_person.cmacc",
                                "city": {
                                    "$$obj$$": result.content.person,
                                    "$$str$$": "city"
                                },
                                "gender": {
                                    "$$file$$": "https://raw.githubusercontent.com/wilmveel/cmacc-test/master/ID/gender/_gender.cmacc",
                                    "He_She": {
                                        "$$obj$$": result.content.person.gender,
                                        "$$str$$": "He/She"
                                    },
                                    "His_Her": {
                                        "$$obj$$": result.content.person.gender,
                                        "$$str$$": "His/Her"
                                    },
                                    "he_she": {
                                        "$$obj$$": result.content.person.gender,
                                        "$$str$$": "he/she"
                                    },
                                    "his_her": {
                                        "$$obj$$": result.content.person.gender,
                                        "$$str$$": "his/her"
                                    },
                                },
                                "name_First": {
                                    "$$obj$$": result.content.person,
                                    "$$str$$": "name_First"
                                },
                                "name_Full": {
                                    "$$obj$$": result.content.person,
                                    "$$str$$": "{{name_First}} {{name_Last}}"
                                },
                                "name_Last": {
                                    "$$obj$$": result.content.person,
                                    "$$str$$": "name_Last"
                                },
                                "pron": {
                                    "$$file$$": "https://raw.githubusercontent.com/wilmveel/cmacc-test/master/Form/_pron.cmacc",
                                    "IWe": {
                                        "$$obj$$": result.content.person.pron,
                                        "$$str$$": "I/We"
                                    },
                                    "Iwe": {
                                        "$$obj$$": result.content.person.pron,
                                        "$$str$$": "I/we"
                                    },
                                    "MyOur": {
                                        "$$obj$$": result.content.person.pron,
                                        "$$str$$": "My/Our"
                                    },
                                    "meus": {
                                        "$$obj$$": result.content.person.pron,
                                        "$$str$$": "me/us"
                                    },
                                    "myour": {
                                        "$$obj$$": result.content.person.pron,
                                        "$$str$$": "my/our"
                                    }
                                }
                            }
                        }
                    }
                )
            });
        });
    });

    describe('Space Folder', function () {
        describe('Space Folder HelloWorld.cmacc', function () {
            it('should pardefine_Mutualse HelloWorld.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'Space Folder', 'HelloWorld.cmacc');
                var result = parse('file://' + file);
                assert.deepEqual(result,{
                    "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/Space Folder/HelloWorld.cmacc",
                    "$$text$$": "name is {{person.name_Full}} lives in {{person.city}}",
                    "person": {
                        "$$file$$": "file:///Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/person.cmacc",
                        "city": {
                            "$$obj$$": result.person,
                            "$$str$$": "city"
                        },
                        "name_First": {
                            "$$obj$$": result.person,
                            "$$str$$": "name_First"
                        },
                        "name_Full": {
                            "$$obj$$": result.person,
                            "$$str$$": "{{name_First}} {{name_Last}}"
                        },
                        "name_Last": {
                            "$$obj$$": result.person,
                            "$$str$$": "name_Last"
                        }
                    }
                })
            });
        });
    });

});
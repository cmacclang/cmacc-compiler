var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('parse', function () {

    var cmacc = require('../src/index');
    var parse = cmacc.parse;

    describe('Variable', function () {

        describe('VariableEmpty.cmacc', function () {
            it('should parse VariableEmpty.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'VariableEmpty.cmacc');

                var result = parse(file);

                assert.deepEqual(result, {
                    "hello1": null,
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableEmpty.cmacc"
                });
            });
        });

        describe('VariableNull.cmacc', function () {
            it('should parse VariableNull.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'VariableNull.cmacc');

                var result = parse(file);

                assert.deepEqual(result, {
                    "hello1": null,
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableNull.cmacc"
                });
            });
        });

        describe('VariableString.cmacc', function () {
            it('should parse VariableString.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'VariableString.cmacc');

                var result = parse(file);

                assert.deepEqual(result, {
                    "hello1": {
                        "$$str$$": "World1"
                    },
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableString.cmacc"
                });
            });
        });

        describe('VariableObject.cmacc', function () {
            it('should parse VariableObject.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'VariableObject.cmacc');

                var result = parse(file);

                assert.deepEqual(result, {
                    "hello1": {
                        "hello1": {
                            "$$str$$": "World1"
                        }
                    },
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc"
                });
            });
        });
    });

    describe('Import', function () {

        describe('ImportObject.cmacc', function () {
            it('should parse ImportObject.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'ImportObject.cmacc');

                var result = parse(file);

                assert.deepEqual(result, {
                    "obj2": {
                        "hello1": {
                            "hello1": {
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc"
                    },
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/ImportObject.cmacc"
                });
            });
        });

        describe('ImportObjectOverwrite.cmacc', function () {
            it('should parse ImportObjectOverwrite.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'ImportObjectOverwrite.cmacc');

                var result = parse(file);

                assert.deepEqual(result, {
                    "obj2": {
                        "hello1": {
                            "hello1": {
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                        "$$mrg$$": {
                            "obj1": {
                                "hello1": {
                                    "$$str$$": "World2"
                                }
                            }
                        }
                    },
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/ImportObjectOverwrite.cmacc"
                });
            });
        });

        describe('ImportObjectSubstitutionImport.cmacc', function () {
            it('should parse ImportObjectSubstitutionImport.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImport.cmacc');

                var result = parse(file);

                assert.deepEqual(result, {
                    "obj3": {
                        "hello1": {
                            "hello1": {
                                "$$str$$": "World1"
                            }
                        },
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                        "$$mrg$$": {
                            "obj1": {
                                "hello1": {
                                    "$$str$$": "World3"
                                }
                            }
                        }
                    },
                    "obj2": {
                        "hello1": {
                            "$$str$$": "World1"
                        },
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableString.cmacc",
                        "$$mrg$$": {
                            "hello1": {
                                "hello1": {
                                    "hello1": {
                                        "$$str$$": "World1"
                                    }
                                },
                                "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                                "$$mrg$$": {
                                    "obj1": {
                                        "hello1": {
                                            "$$str$$": "World3"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/ImportObjectSubstitutionImport.cmacc"
                });
            });
        });

        describe('ImportObjectSubstitutionImportDouble.cmacc', function () {
            it('should parse ImportObjectSubstitutionImportDouble.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImportDouble.cmacc');

                var result = parse(file);

                assert.deepEqual(result, {
                    "obj3": {
                        "obj3": {
                            "hello1": {
                                "hello1": {
                                    "$$str$$": "World1"
                                }
                            },
                            "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                            "$$mrg$$": {
                                "obj1": {
                                    "hello1": {
                                        "$$str$$": "World3"
                                    }
                                }
                            }
                        },
                        "obj2": {
                            "hello1": {
                                "$$str$$": "World1"
                            },
                            "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableString.cmacc",
                            "$$mrg$$": {
                                "hello1": {
                                    "hello1": {
                                        "hello1": {
                                            "$$str$$": "World1"
                                        }
                                    },
                                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/VariableObject.cmacc",
                                    "$$mrg$$": {
                                        "obj1": {
                                            "hello1": {
                                                "$$str$$": "World3"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/ImportObjectSubstitutionImport.cmacc",
                        "$$mrg$$": {
                            "obj2": {
                                "obj1": {
                                    "hello1": {
                                        "$$str$$": "World3"
                                    }
                                }
                            }
                        }
                    },
                    "$$text$$": "{{obj}}",
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/ImportObjectSubstitutionImportDouble.cmacc"
                });
            });
        });
    });

    describe('Merge', function () {

        describe('MergeSimple.cmacc', function () {
            it('should parse MergeSimple.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'MergeSimple.cmacc');

                var result = parse(file);

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
            });
        });

        describe('MergeDepth.cmacc', function () {
            it('should parse MergeDepth.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'MergeDepth.cmacc');

                var result = parse(file);

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
            });
        });

        describe('MergeOverwrite.cmacc', function () {
            it('should parse MergeOverwrite.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'MergeOverwrite.cmacc');

                var result = parse(file);

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
                                "hello1": {
                                    "$$str$$": "World2"
                                }
                            }
                        }
                    },
                    "$$file$$": "/Users/willemveelenturf/projects/commonaccord/cmacc-compiler/test/parse/MergeOverwrite.cmacc"
                });
            });
        });

        describe('MergeSimple.cmacc', function () {
            it('should parse MergeSimple.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'MergeSimple.cmacc');

                var result = parse(file);

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
            });
        });

        describe('MergeDepth.cmacc', function () {
            it('should parse MergeDepth.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'MergeDepth.cmacc');

                var result = parse(file);

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
            it('should parse DeeperVars.cmacc', function () {
                var file = path.join(__dirname, 'parse', 'DeeperVars.cmacc');

                var result = parse(file);

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

            });
        });

    });


});
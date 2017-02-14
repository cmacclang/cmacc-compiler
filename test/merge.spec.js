var assert = require('assert');
var merge = require('../src/merge');

describe('merge0', function () {
    it('flat', function () {

        var obj1 = {
            test1: {
                $$str$$: 'test1'
            }
        };

        var obj2 = {
            test2: {
                $$str$$: 'test2'
            }
        };

        var res = merge(obj1, obj2)

        assert.deepEqual(res, {
            test1: {
                $$str$$: 'test1'
            },
            test2: {
                $$str$$: 'test2'
            }
        });

    });

    it('deep', function () {

        var obj1 = {
            test1: {
                hoi: {$$str$$: 'test1'}
            }
        };

        var obj2 = {
            test1: {
                doei: {$$str$$: 'test2'}
            }
        };

        var res = merge(obj1, obj2)

        assert.deepEqual(res, {
            test1: {
                hoi: {
                    $$str$$: 'test1'
                },
                doei: {
                    $$str$$: 'test2'
                }
            }
        });

    });

});
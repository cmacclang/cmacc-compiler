var assert = require('assert');
var merge = require('../src/merge');

describe('merge0', function () {
    it('flat', function () {
        var obj1 = {
            test1 : 'test1'
        };

        var obj2 = {
            test2 : 'test2'
        };

        var res = merge(obj1, obj2)

        assert.deepEqual(res, { test1: 'test1', test2: 'test2' });

    });

    it('deep', function () {
        var obj1 = {
            test1 : {
                hoi: 'test1'
            }
        };

        var obj2 = {
            test1 : {
                doei: 'test2'
            }
        };

        var res = merge(obj1, obj2)

        assert.deepEqual(res, { test1: { hoi: 'test1', doei: 'test2' } });
    });
});
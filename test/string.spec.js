var assert = require('assert');

var fs = require('fs');
var path = require('path');

var string = require('../src/string');

describe('string', function () {


    it('should single string', function () {
        var val = 'test';
        var obj = {};
        var res = string(val, obj);
        assert.deepEqual(res, {
            $$str$$: 'test',
            $$obj$$: {}
        });
    });

    it('should pojo', function () {
        var val = {
            test: 'test'
        };
        var obj = {};
        var res = string(val, obj);
        assert.deepEqual(res, {
            test: {
                $$str$$: 'test',
                $$obj$$: {}
            }

        });
    });

});
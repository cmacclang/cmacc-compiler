var assert = require('assert');

var fs = require('fs');
var path = require('path');

var string = require('../src/string');

describe('string', function () {


    it('should single string', function (done) {
        var val = 'test'
        var res = string(val)
        assert.equal(res(), "123");
        done();
    });

    it('should pojo', function (done) {
        var val = {
            test: 'test'
        };
        var res = string(val)
        assert.equal(res.test(), "[Function]");
        done();
    });


});
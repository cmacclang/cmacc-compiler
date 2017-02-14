var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('find', function () {

    var cmacc = require('../src/index');

    describe('HelloWorld', function () {
        it('should find prameters in HelloWorld.cmacc', function (done) {
            var file = path.join(__dirname, 'find', './HelloWorld.cmacc');
            var result = cmacc.compile('file://' + file);
            var vars = cmacc.find(result);
            assert.deepEqual(vars, {test: null, world: 'World'});
            done();
        });

    });

    describe('HelloWorldComcat.cmacc', function () {
        it('should find prameters', function (done) {
            var file = path.join(__dirname, 'find', './HelloWorldComcat.cmacc');
            var result = cmacc.compile('file://' + file);
            var vars = cmacc.find(result);
            assert.deepEqual(vars, {
                firstName: 'World',
                lastName: 'World',
                fullName: '{{firstName}} {{lastName}}'
            });
            done();
        });

        it('should render with params', function (done) {
            var data = {
                firstName: 'Willem',
                lastName: 'Veelenturf',
                fullName: '{{firstName}} {{lastName}}'
            };

            var file = path.join(__dirname, 'find', './HelloWorldComcat.cmacc');
            var ast = cmacc.compile('file://' + file);

            var string = cmacc.string(data);

            var doc = cmacc.merge(ast, string);
            var result = cmacc.render(doc);

            assert.equal(result, "Willem Veelenturf");

            done();

        });

        it('should render with params change concat', function (done) {
            var data = {
                firstName: 'Willem',
                lastName: 'Veelenturf',
                fullName: '{{firstName}} {{lastName}} {{firstName}}'
            };

            var file = path.join(__dirname, 'find', './HelloWorldComcat.cmacc');
            var ast = cmacc.compile('file://' + file);

            var string = cmacc.string(data);

            var doc = cmacc.merge(ast, string);
            var result = cmacc.render(doc);

            assert.equal(result, "Willem Veelenturf Willem");

            done();

        });



    });


    describe('Form.cmacc', function () {
        it('should render with params change concat', function (done) {
            var data = {
                "person1": {
                    "firstName": "Willem",
                    "lastName": "Veelenturf",
                    "fullName": "{{firstName}} {{lastName}}"
                },
                "person2": {
                    "firstName": "Axel",
                    "lastName": "Scheele",
                    "fullName": "{{firstName}} {{lastName}} {{firstName}}"
                }
            };


            var file = path.join(__dirname, 'find', './Form.cmacc');
            var ast = cmacc.compile('file://' + file);

            var string = cmacc.string(data);

            var doc = cmacc.merge(ast, string);
            var result = cmacc.render(doc);

            assert.deepEqual(result, "This is an agreement between Willem Veelenturf and Axel Scheele Axel");

            done();

        });



    });

});
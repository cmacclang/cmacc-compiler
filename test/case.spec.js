var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('case', function () {

    var cmacc = require('../src/index');

    var parse = cmacc.parse;
    var resolve = cmacc.resolve;

    var run = function (file) {
        try {
            var ast = parse(file);
            console.log(JSON.stringify(ast, null, 4))
            var result = resolve(ast);
        } catch (e) {
            console.log(e)
        }
        return result;
    };

    describe('id', function () {
        it('should parse doc.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './id/doc.cmacc');
            var result = run(file);
            assert.equal(result, "Name: Willem Veelenturf Willem Veelenturf");
            done();
        });

        it('should parse doc_overwrite.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './id/doc_overwrite.cmacc');
            var result = run(file);
            assert.equal(result, "Name: Willem Veelenturf Veelenturf Willem 1234");
            done();

        });
    });

    describe('person_double_import', function () {
        it('should parse doc.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './person_double_import/doc.cmacc');

            var result = run(file);

            assert.equal(result, "This agreement is between name_First name_Last and name_First name_Last.");
            done()

        });
    });

    describe('helloworld', function () {
        it('should parse helloworld/HelloWorld.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './helloworld/HelloWorld.cmacc');

            var result = run(file);

            assert.equal(result, "His/Her name is name_First name_Last and he/she lives in city\n");
            done()

        });
    });

    describe('multiple_parameters_passed', function () {
        it('should parse multiple_parameters_passed/_test_sign.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './multiple_parameters_passed/_test_sign.cmacc');
            var result = run(file);
            assert.equal(result, "IN WITNESS WHEREOF, the undersigned have caused this instrument to be duly executed and delivered.\n\nRole: Party1\n\nName: Marc Dangeard  \nPlace: sign_Place\nDate: sign_Date\n-------------------------\n\n\n");
            done()

        });
    });

    describe('parameters_across_multiple_files draft1', function () {
        it('should parse parameters_across_multiple_files/draft1.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './parameters_across_multiple_files/draft1.cmacc');
            var result = run(file);
            assert.equal(result, "**Test Agreement**\n\nThis is where you explain what this agreement is about\n\n\n 1. This agreement is between Marc Dangeard and James Hazard\n\n\n 2. The goal of this agreement is to define the modalities for testing a new editing solution for CommonAccord project\n\n\n 3. The agreement will be structured based on standard clauses to be defined.\n\nIN WITNESS WHEREOF, the undersigned have caused this instrument to be duly executed and delivered.\n\n<table width=\"100%\">\n<tr>\n<td>Role: Party1\n\nName: Marc Dangeard  \nPlace: sign_Place\nDate: sign_Date\n-------------------------\n</td>\n<td>Role: Party2\n\nName: James Hazard  \nPlace: sign_Place\nDate: sign_Date\n-------------------------\n</td>\n</tr>\n</table>\n\n")
            done()

        });
    });

    describe('parameters_across_multiple_files test1', function () {
        it('should parse parameters_across_multiple_files/test1.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './parameters_across_multiple_files/test1.cmacc');
            var result = run(file);
            assert.equal(result, "**Test Agreement**\n\nThis is where you explain what this agreement is about\n\n\n 1. This agreement is between Marc Dangeard and James Hazard\n\n\n 2. The goal of this agreement is to define the modalities for testing a new editing solution for CommonAccord project\n\n\n 3. The agreement will be structured based on standard clauses to be defined.\n\nIN WITNESS WHEREOF, the undersigned have caused this instrument to be duly executed and delivered.\n\n<table width=\"100%\">\n<tr>\n<td>Role: Party1\n\nName: Marc Dangeard  \nPlace: sign_Place\nDate: sign_Date\n-------------------------\n</td>\n<td>Role: Party2\n\nName: James Hazard  \nPlace: sign_Place\nDate: sign_Date\n-------------------------\n</td>\n</tr>\n</table>\n\n")
            done()

        });
    });

    describe('parameters_across_multiple_files test2', function () {
        it('should parse parameters_across_multiple_files/test2.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './parameters_across_multiple_files/test2.cmacc');
            var result = run(file);
            assert.equal(result, "**Test Agreement**\n\nThis is where you explain what this agreement is about\n\n\n 1. This agreement is between Marc Dangeard and James Hazard\n\n\n 2. The goal of this agreement is to define the modalities for testing a new editing solution for CommonAccord project\n\n\n 3. The agreement will be structured based on standard clauses to be defined.\n\nIN WITNESS WHEREOF, the undersigned have caused this instrument to be duly executed and delivered.\n\n<table width=\"100%\">\n<tr>\n<td>Role: Party1\n\nName: Marc Dangeard  \nPlace: sign_Place\nDate: sign_Date\n-------------------------\n</td>\n<td>Role: Party2\n\nName: James Hazard  \nPlace: sign_Place\nDate: sign_Date\n-------------------------\n</td>\n</tr>\n</table>\n\n")
            done()

        });
    });

    describe('overwrite_root_vars', function () {
        it('should parse overwrite_root_vars/class.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './overwrite_root_vars/class.cmacc');
            var result = run(file);
            assert.equal(result, "__name__ __name__\n")
            done()

        });

        it('should parse overwrite_root_vars/layer1.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './overwrite_root_vars/layer1.cmacc');
            var result = run(file);
            assert.equal(result, "__name__ __name__\n")
            done()

        });

        it('should parse overwrite_root_vars/layer2.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './overwrite_root_vars/layer2.cmacc');
            var result = run(file);
            assert.equal(result, "Willem Willem\n")
            done()

        });

        it('should parse overwrite_root_vars/layer3.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './overwrite_root_vars/layer3.cmacc');
            var result = run(file);
            assert.equal(result, "Piet Piet\n")
            done()

        });

        it('should parse overwrite_root_vars/layerx.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './overwrite_root_vars/layerx.cmacc');
            var result = run(file);
            assert.equal(result, "Piet Piet\n")
            done()

        });

        it('should parse overwrite_root_vars/index.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './overwrite_root_vars/index.cmacc');
            var result = run(file);
            assert.equal(result, "Willem Willem\n\n")
            done()

        });
    });

});
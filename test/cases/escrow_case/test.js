const url = require('path');
const assert = require('assert');
const cmacc = require('../../../src/index');

const Remarkable = require('remarkable');
const md = new Remarkable();

describe('escrow_case', function () {

  global.fs = require('fs');
  global.fetch = require('node-fetch');

  it('Escrow', function (done) {
    const file = url.join('file://', __dirname, './Escrow.cmacc')
    cmacc.compile(file)
      .then(ast => {
        assert.equal(ast.seller.full_Name, 'name_Full');
        done();
      })
      .catch(done);

  });

  it('Step1_Parties', function (done) {
    const file = url.join('file://', __dirname, './Step1_Parties.cmacc')
    cmacc.compile(file)
      .then(ast => {
        assert.equal(ast.seller.full_Name, 'Gerry\'s Grapes, LLC');
        assert.equal(ast.deal.seller.full_Name, 'Gerry\'s Grapes, LLC');
        done();
      })
      .catch(done);

  });

  it('Step2_Order', function (done) {
    const file = url.join('file://', __dirname, './Step2_Order.cmacc')
    cmacc.compile(file)
      .then(ast => {
        assert.equal(ast.deal.price_USD, '$650.00');
        assert.equal(ast.deal.seller.full_Name, 'Gerry\'s Grapes, LLC');

        assert.equal(ast.seller.full_Name, 'Gerry\'s Grapes, LLC');
        done();
      })
      .catch(done);

  });


});
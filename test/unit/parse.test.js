const assert = require('assert');
const parser = require('../../src/index').parser;


describe('parse', () => {


  it('case1', () => {


    const text = `---
title: Nice contract
author : Willem Veelenturf
---

$ person1 = [./person1.json]
$ person2 = [./person2.json]

$ function1 = [./function1.js](person1, person2)

$ function2 = [./function2.js](person1, person2)

$ doc = [./contract.cmacc]
$ doc.person1 = person1
$ doc.person2 = person2

$ signtures = [./signtures_2.cmacc]

{{doc}}

{{signtures}}`;

    const res = parser(text);

    assert.equal(res.meta.author, "Willem Veelenturf");
    assert.equal(res.meta.title, "Nice contract");

    assert.equal(res.vars[0], "person1 = [./person1.json]");
    assert.equal(res.vars[2], "function1 = [./function1.js](person1, person2)");

  });

});
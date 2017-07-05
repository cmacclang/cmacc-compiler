const assert = require('assert');
const path = require('path');

const fsMock = require('fs-mock');

const compiler = require('../../src/index').compile;
const render = require('../../src/index').render;


describe('render', () => {

  function fileMock(file, text) {
    var data = {};
    data[path.resolve(__dirname, '../../../', file)] = text;
    global.fs = new fsMock(data);
  }

  it('link', (done) => {

    const base = 'file:\/\/:' + path.resolve(__dirname, '../../');

    const opts = {base};

    const cmacc1 = `$ world = "world1"
    
$ link = [./test.cmacc]

# Hello {{world}}

{{link}}

## Test`;

    const cmacc2 = `$ world = "world2"
    
# Hello {{world}}

Dit is een berichtje`;

    fileMock("./test.cmacc", cmacc2)

    compiler(cmacc1, opts).then((ast) => {


      const html = render(ast);

      const val = `<h1>Hello world1</h1>
<h1>Hello world2</h1>
<p>Dit is een berichtje</p>
<h2>Test</h2>
`;

      assert.equal(html, val);
      done();
    });

  });

});
const assert = require('assert');
const path = require('path');

const fsMock = require('fs-mock');
const fetchMock = require('fetch-mock');

const compiler = require('../../src/index').compile;
const reduce = require('../../src/index').reduce;
const render = require('../../src/index').render;

describe('compiler', () => {


  function fileMock(file, text){
    var data = {};
    data[path.resolve(__dirname, '../../', file)] = text;
    global.fs = new fsMock(data);
  }

  function httpMock(file){
    fetchMock.get(file, text);
  }

  it('simple', (done) => {

    const text = `$ world = "world"
    
# Hello {{world}}`;

    compiler(text).then((ast) => {
      assert.equal(ast.md[0].type, 'heading_open');
      assert.equal(ast.md[1].content, 'Hello {{world}}');
      assert.equal(ast.md[2].type, 'heading_close');
      done();
    });

  });

  it('link', (done) => {

    const cmacc1 = `$ world = "world1"
    
$ link = [./test.cmacc]

# Hello {{world}}

{{link}}

## Test`;

    const cmacc2 = `$ world = "world2"
    
# Hello {{world}}

Dit is een berichtje`;

    fileMock("./test.cmacc", cmacc2)

    compiler(cmacc1).then((ast) => {

      //console.log(JSON.stringify(ast, null, 2))

      const res = reduce(ast);


      console.log(JSON.stringify(res, null, 2));

      const html = render(res);

      console.log(html);

      done();
    });

  });


});
const assert = require('assert');
const render = require('../../src/index').render;


describe('parse', () => {


  it('heading', () => {


    const text = `$ world = "world"

# Hello {{world}}
`;

    const ast = parser(text);
    const html = render(ast);

    assert.equal(html, "<h1>Hello world</h1>\n");

  });

  it('one paragraph two lines', () => {


    const text = `$ hello = "Hello"
    $ world = "world"

This is a story about {{hello}}
And {{world}}
`;

    const ast = parser(text);
    const html = render(ast);

    assert.equal(html, "<p>This is a story about Hello\nAnd world</p>\n");

  });

  it('two paragraphs', () => {


    const text = `$ hello = "Hello"
    $ world = "world"

This is a story about {{hello}}

And {{world}}
`;

    const ast = parser(text);
    const html = render(ast);

    assert.equal(html, "<p>This is a story about Hello</p>\n<p>And world</p>\n");

  });


});
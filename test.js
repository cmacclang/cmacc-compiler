var expr = 'foo'

var obj = {
  baz: 'bar',
}

obj.__defineSetter__('foo', function(val) { this.baz = val; });
obj.__defineGetter__('foo', function() { return this.baz; });


console.log(obj.baz);
console.log(obj.foo);
obj.foo = 123;
console.log(obj.baz);
console.log(obj.foo);
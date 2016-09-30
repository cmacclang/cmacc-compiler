var test1 = "1"
var test2 = test1
var test3 = test2


test1 = 8

console.log(test1)
console.log(test2)
console.log(test3)


var obj = {
    test1: 'test1',
    test2: 'test2',
    test3: 'test3'
}

obj.test2 = obj.test1
obj.test3 = obj.test2

obj.test2 = test1

console.log(obj.test1)
console.log(obj.test2)
console.log(obj.test3)
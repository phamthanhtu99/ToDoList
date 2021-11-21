var arr = {
    name: 'Java',
    price: 123123,
    childen: {
        name: 'reactjs'
    },
    des: false
}


var { name: name_1, price, childen: { name: name_2 }, des = 'true' } = arr;
console.log(name_1)
console.log(name_2)
console.log(des)

function logger(...param) {
    console.log(param);
}
logger(1, 2, 3, 4, 5, 6)

// var arr = ['java', 'ruy', 'PHP']
// var arr_1 = ['react', 'vuj', 'PHP']
// var a = [...arr, ...arr_1]

var ob1 = {
    name: 'tu'
}
var ob2 = {
    price: 12323
}
console.log({...ob1, ...ob2 })



var name = 'tu'
var age = '1'

function highlinght(...rest) {
    console.log(rest)
}

highlinght `học lap trinh ${name} tại ${age}`


import demo from './logger/index.js'
import * as commont from './commont.js'
console.log(commont);
demo('tú', commont.type_error)
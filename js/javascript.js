// Find(function)

const array = [3, 4, 5, 8, 6, 78, 56, 10];
const check = (arr) => {
    return arr > 4
}
const result = array.find(check);
// console.log(result)


// FindIndex(function)

const array2 = [3, 4, 5, 8, 6, 78, 56, 10];
const check2 = (arr) => {
    return arr > 4
}
const result2= array2.findIndex(check2);
// console.log(result2)

// Reduce(function)

// forEach()...for/of...for/in

const arr2 = ["a", "b", "c"];

for (let i = 0; i < arr2.length; i++) {
    // console.log(arr2[i])
    // console.log(i)
}

arr2.forEach((elem, index) => {
    // console.log(elem, index)
});

for (elem of arr2) {
    console.log("for/of", elem)
}

for (elem in arr2) {
    // console.log("for/in", elem)
}

const arr = ['a', 'b', 'c'];
arr.test = 'bad';
arr[1] === arr['1'];

// Prints "a, b, c, bad"
for (let i in arr) {
//   console.log(arr[i]);
}

const arr3 = ['a',,, 'c'];

// 3
// console.log(arr3.length);
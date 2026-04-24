const sumDown = require("./sumDown");
const sumUp = require("./sumUp");
const sumMixed = require("./sumMixed");
const cyclicSum = require("./cyclic");
const { getError, checkX } = require("./utils");

const x = 0.5;
const n = 5;

checkX(x);

console.log(" Результати:");

const down = sumDown(n, x);
const up = sumUp(n, x);
const mixed = sumMixed(n, x);
const cycle = cyclicSum(n, x);

console.log("Рекурсія на спуску:", down);
console.log("Рекурсія на поверненні:", up);
console.log("Комбінований варіант:", mixed);
console.log("Циклічний варіант:", cycle);


const exact = Math.log(1 + x);
console.log("Точне значення:", exact);

console.log("\n Похибки:");

console.log("Down:", getError(down, x));
console.log("Up:", getError(up, x));
console.log("Mixed:", getError(mixed, x));
console.log("Cycle:", getError(cycle, x));

console.log("\n Дані для графіка:");


console.log("x,error");

for (let xi = -0.9; xi <= 0.9; xi += 0.1) {
    let approx = cyclicSum(n, xi);
    let err = Math.abs(approx - Math.log(1 + xi));
    console.log(xi.toFixed(2) + "," + err);
}

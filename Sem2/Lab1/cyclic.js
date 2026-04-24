function cyclicSum(n, x) {
    let current = x;
    let sum = current;

    for (let i = 2; i <= n; i++) {
        current = -current * x * ((i - 1) / i);
        sum += current;
    }

    return sum;
}

module.exports = cyclicSum;
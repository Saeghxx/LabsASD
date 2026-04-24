function sumUp(n, x) {
    if (n === 1) return x;

    const prevSum = sumUp(n - 1, x);

    let current = x;
    for (let i = 2; i <= n; i++) {
        current = -current * x * ((i - 1) / i);
    }

    return prevSum + current;
}

module.exports = sumUp;
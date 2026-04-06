function sumDown(n, x, i = 1, current = x, sum = 0) {
    if (i > n) return sum;

    sum += current;
    const next = -current * x * (i / (i + 1));

    return sumDown(n, x, i + 1, next, sum);
}

module.exports = sumDown;
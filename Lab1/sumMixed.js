function getFi(i, x, prev) {
    if (i === 1) return x;
    return -prev * x * ((i - 1) / i);
}

function sumMixed(n, x, i = 1, prev = x) {
    if (i === n) return prev;

    const next = getFi(i + 1, x, prev);

    return prev + sumMixed(n, x, i + 1, next);
}

module.exports = sumMixed;
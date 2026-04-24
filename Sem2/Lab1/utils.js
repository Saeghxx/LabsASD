function getError(approx, x) {
    return Math.abs(approx - Math.log(1 + x));
}

function checkX(x) {
    if (x <= -1 || x >= 1) {
        throw new Error("x має бути в межах (-1, 1)");
    }
}

module.exports = { getError, checkX };
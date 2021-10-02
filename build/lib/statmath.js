"use strict";
exports.__esModule = true;
exports.binompdf = void 0;
function fact(n) {
    if (n == 1 || n == 0) {
        return 1;
    }
    else {
        return n * fact(Math.floor(n - (n > 0 ? 1 : -1)));
    }
}
function binomcoeff(n, k) {
    if (n < k)
        return NaN;
    if (k == 1)
        return n;
    if (k == 0)
        return 1;
    return fact(n) / (fact(k) * fact(n - k));
}
function binomcoeffrecur(n, k) {
    if (n == k)
        return 1;
    if (k == 1)
        return n;
    if (k == 0)
        return 1;
    return binomcoeffrecur(n - 1, k) + binomcoeffrecur(n - 1, k - 1);
}
function binompdf(n, p, k) {
    return binomcoeffrecur(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}
exports.binompdf = binompdf;

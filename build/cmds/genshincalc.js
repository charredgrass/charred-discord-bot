"use strict";
exports.__esModule = true;
var HARDPITY = 90;
function pullpmf(n, p) {
    var d = p * 10;
    if (n <= 0) {
        return 0;
    }
    else if (n <= 73) {
        return p * Math.pow(1 - p, n - 1);
    }
    else if (n <= 89) {
        var res = Math.pow(1 - p, 73) * (p + (n - 73) * d);
        for (var i = 1; i <= n - 74; i++) {
            res *= 1 - p - n * d;
        }
        return res;
    }
    else {
        return 0;
    }
}
function pullcmf(n, p) {
    if (n <= 0) {
        return 0;
    }
    else if (n <= 73) {
        return 1 - Math.pow(1 - p, n);
    }
    else if (n <= 89) {
        var sum = 0;
        for (var i = 1; i <= n; i++) {
            sum += pullpmf(i, p);
        }
        return sum;
    }
}
var chanceIn = {
    name: "chancein",
    run: function (args, message) {
        var pulls = Number(args[1]);
        if (isNaN(pulls)) {
            return message.channel.send("Invalid arguments. Syntax: !chancein [kc]");
        }
        if (pulls >= HARDPITY * 2) {
            return message.channel.send("You are guaranteed.");
        }
    },
    select: function (selector) {
        return selector.dms;
    }
};

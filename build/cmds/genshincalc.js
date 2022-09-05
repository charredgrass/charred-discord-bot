"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HARDPITY = 90;
function pullpmf(n, p) {
    let d = p * 10;
    if (n <= 0) {
        return 0;
    }
    else if (n <= 73) {
        return p * Math.pow(1 - p, n - 1);
    }
    else if (n <= 89) {
        let res = Math.pow(1 - p, 73) * (p + (n - 73) * d);
        for (let i = 1; i <= n - 74; i++) {
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
        let sum = 0;
        for (let i = 1; i <= n; i++) {
            sum += pullpmf(i, p);
        }
        return sum;
    }
}
let chanceIn = {
    name: "chancein",
    run: (args, message) => {
        let pulls = Number(args[1]);
        if (isNaN(pulls)) {
            return message.channel.send("Invalid arguments. Syntax: !chancein [kc]");
        }
        if (pulls >= HARDPITY * 2) {
            return message.channel.send("You are guaranteed.");
        }
    },
    select: (selector) => {
        return selector.dms;
    }
};

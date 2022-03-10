"use strict";
exports.__esModule = true;
exports.augprob = void 0;
var PROBABILITIES = [
    ["ssg", 30], ["sgg", 18], ["gsg", 12], ["ssp", 9], ["ggg", 7], ["sgp", 4],
    ["ggp", 4], ["gsp", 4], ["sps", 3], ["pgg", 2], ["psg", 2], ["gpg", 2],
    ["psp", 1], ["ppp", 1], ["spp", 1]
];
var augprob = {
    "name": "augprob",
    run: function (args, message) {
        return message.channel.send("100%");
    },
    select: function (selector) {
        return selector.dms;
    }
};
exports.augprob = augprob;

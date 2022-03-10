"use strict";
exports.__esModule = true;
var fs = require("fs");
var system = {
    players: []
};
var config = JSON.parse(fs.readFileSync("./config.json").toString("utf-8"));

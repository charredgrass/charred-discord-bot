"use strict";
exports.__esModule = true;
exports.callAPI = void 0;
var request = require("request");
function callAPI(url, cb, ecb) {
    try {
        request(url, cb);
    }
    catch (err) {
        ecb("API Error: " + err.message);
    }
}
exports.callAPI = callAPI;

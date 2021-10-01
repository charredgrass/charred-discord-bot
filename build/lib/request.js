"use strict";
exports.__esModule = true;
exports.callAPI = void 0;
var request = require("request");
var options = {
    headers: {
        'User-Agent': "charredgrass/charred-discord-bot - @Charred#9898"
    }
};
function callAPI(url, cb, ecb) {
    try {
        request({
            url: url,
            headers: {
                'User-Agent': "charredgrass/charred-discord-bot - @Charred#9898"
            }
        }, cb);
    }
    catch (err) {
        ecb("API Error: " + err.message);
    }
}
exports.callAPI = callAPI;

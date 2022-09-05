"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAPI = void 0;
const request = require("request");
let options = {
    headers: {
        'User-Agent': "charredgrass/charred-discord-bot - @Charred#9898"
    }
};
function callAPI(url, cb, ecb) {
    try {
        request({
            url,
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
function callAPIPromise(url) {
    return new Promise((resolve, reject) => {
        try {
            request({
                url,
                headers: {
                    'User-Agent': "charredgrass/charred-discord-bot - @Charred#9898"
                }
            }, (e, r, body) => {
                resolve(body);
            });
        }
        catch (err) {
            reject("API Error: " + err.message);
        }
    });
}

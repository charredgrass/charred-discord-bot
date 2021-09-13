"use strict";
exports.__esModule = true;
exports.getGEPrice = exports.pingAPI = void 0;
var request_1 = require("../lib/request");
var RS_GE = "http://services.runescape.com/m=itemdb_oldschool";
var itemcache = {};
var pingAPI = {
    name: "pingapi",
    run: function (args, message) {
        request_1.callAPI(RS_GE + "/api/info.json", function (e, r, body) {
            var respjson;
            try {
                respjson = JSON.parse(body);
                message.channel.send("API last update Runedate=" + respjson.lastConfigUpdateRuneday);
            }
            catch (err) {
                message.channel.send("API Error: malformed response");
                return;
            }
        }, console.log);
    },
    select: function (selector) {
        return selector.rs;
    }
};
exports.pingAPI = pingAPI;
function scanGE(name, cb, letter, pnum) {
    console.log("Scanning page " + pnum + " for " + name);
    request_1.callAPI(RS_GE + "/api/catalogue/items.json?category=1&alpha=" + letter + "&page=" + pnum, function (e, r, body) {
        var respjson;
        try {
            respjson = JSON.parse(body);
            var items = respjson.items;
            if (items.length == 0) {
                cb(false, null);
                return;
            }
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                if (item.name.toLowerCase() == name.toLowerCase()) {
                    console.log("hit");
                    cb(true, item);
                    return;
                }
            }
            scanGE(name, cb, letter, pnum + 1);
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }, console.log);
}
function findItem(name, cb) {
    var firstLetter = name.toLowerCase()[0];
    scanGE(name, cb, firstLetter, 1);
}
var getGEPrice = {
    name: "price",
    run: function (args, message) {
        if (args.length == 1) {
            message.channel.send("Usage: `!price <item>`");
        }
        else {
            var itemName = args.slice(1).join(" ");
            message.channel.sendTyping();
            var item = findItem(itemName, function (isFound, item) {
                if (isFound === true) {
                    message.channel.send("Price: " + item["current"]["price"]);
                }
                else {
                    message.channel.send("Item not found.");
                }
            });
        }
    },
    select: function (selector) {
        return selector.rs;
    }
};
exports.getGEPrice = getGEPrice;

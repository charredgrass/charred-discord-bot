const request = require("request");

function getWowTokenPrice(token, cb) {
    const base_URL = "https://us.api.battle.net/data/wow/token/?namespace=dynamic-us&locale=en_US&access_token=";
    try {
        request("https://us.api.battle.net/data/wow/token/?namespace=dynamic-us&locale=en_US&access_token=" + token, function(error, response, body) {
            // if (!error && response.statusCode == 200) {
            //     ticker = Number(JSON.parse(body).USD.last);
            //     debug("BTC Price set to $" + ticker);
            //     updateSatPB();
            //     cb(ticker);
            // } else {
            //     warn("Error refreshing BTC price: " + response.statusCode);
            // }
            if (!error && response.statusCode == 200) {
                const val = Number(JSON.parse(body).price);
                cb(val / 10000);
            }
        });
    } catch (err) {
        cb("Error: " + err.message);
    }
}

module.exports = {
    getWowTokenPrice
}
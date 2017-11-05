var request = require("request");

function get(url, cb) {
    try {
        request(url, (err, resp, body) => {
            if (!err && resp.statusCode == 200) {
                cb(null, JSON.parse(body));
            } else {
                cb("Error Status Code " + resp.statusCode);
            }
        });
    } catch (err) {
        cb(err.message);
    }
}

module.exports = {
    get
};
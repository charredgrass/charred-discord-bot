const http = require("./http.js");

function getCardImage(query, cb) {
  const URL = "http://api.magicthegathering.io/v1/cards?name=" + query;
  http.get(URL, (err, body) => {
    if (err) {
      cb(err);
    } else {
      cb(body.cards[0].name, body.cards[0].imageUrl);
    }
  });
}

function mtgCardImage(args, send, server, author, sendImg) {
  let query = args.join(" ");
  getCardImage(query, sendImg);
}

module.exports = {
  mtgCardImage
};
const http = require("../http.js");

function displayResultImage(cards) {
  return cards[0].image_uris.normal;
}

/**
 * @param {string} query
 * @param {function} cb
 */
function getCard(query, cb) {
  const URL = "https://api.scryfall.com/cards/search?" + query;
  http.get(URL, (err, body) => {
    if (err) {
      cb(err);
    } else {
      // console.log(JSON.stringify(body.data, null, 2));
      cb(null, body.data);
    }
  })
}


//todo encodeURIComponent
// getCard("q=Negate", console.log);

function chatImageSearch(args, send, server, author, sendImg) {
  getCard("q=" + args.join(" "), (err, cards) => {
    if (err) {
      send(err)
    } else {
      sendImg("", displayResultImage(cards));
    }
  });
}

module.exports = {
  chatImageSearch
};
const http = require("./http.js");

function getCardImage(query, cb) {
  const URL = "http://api.magicthegathering.io/v1/cards" + query;
  http.get(URL, (err, body) => {
    if (err) {
      cb(err);
    } else {
      if (!body.cards || body.cards.length === 0) {
        cb("Card not found.");
      } else {
        for (let i = 0; i < body.cards.length; i++) {
          if (body.cards[i].imageUrl) {
            cb(body.cards[i].name, body.cards[i].imageUrl);
            return;
          }
        }
        cb(body.cards[0].name, body.cards[0].imageUrl);
      }
    }
  });
}

function getPrintings(query, cb) {
  const URL = "http://api.magicthegathering.io/v1/cards" + query;
  http.get(URL, (err, body) => {
    if (err) {
      cb(err);
    } else {
      if (!body.cards || body.cards.length === 0) {
        cb("Card not found.");
      } else {
        cb(body.cards[0].printings.join(", "));
      }
    }
  });
}

/**Checks if the string is a flag (starts with --, i.e. --help)
 * @param {String} arg
 * @returns {boolean}
 */
function isFlag(arg) {
  return /^--[\w]+/.test(arg);
}

function createURIQuery(args) {
  if (args.length === 0) return "";
  let query = (isFlag(args[0]) ? "" : "?name=");
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (isFlag(arg)) {
      let flag = arg.substring(2);
      query += (query === "" ? "?" : "&") + flag + "=";
    } else {
      if (query[query.length-1] !== "=") query += " ";
      query += arg;
    }
  }
  return query;
}

/**Query the MTGIO API to retrieve a card's image.
 * @param {Array} args
 * @param {Function} send
 * @param {Object} server
 * @param {Snowflake} author
 * @param {Function} sendImg
 */
function mtgCardImage(args, send, server, author, sendImg) {
  let query = createURIQuery(args);
  // let query = args.join(" ");//TODO make this less messy
  getCardImage(query, sendImg);
}

function mtgSets(args, send) {
  let query = createURIQuery(args);
  getPrintings(query, send);
}

module.exports = {
  mtgCardImage,
  mtgSets
};
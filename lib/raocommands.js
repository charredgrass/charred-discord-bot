const utils = require("./utils.js");

/**Returns a function that can be placed into commands to return the stuff in whois.
 * @params {Object} data The whois data loaded from whois.json
 * @returns {Function}
 * **/
function whoIsCreator(data) {
  return (args, send, server) => {
    if (server.rao) {
      let name = args.join(" ");
      if (data.hasOwnProperty(name)) {
        send(name + " is " + data[name]);
      }
    }
  }
}

/**Returns a function that parses the !joke command.
 * @params {Array} jokes The jokes to use.
 * @returns {Function}
 * **/
function jokesCreator(jokes) {
  return (args, send, server) => {
    if (server.rao) {
      if (!args[0]) { //random joke
        let rand = Math.floor(Math.random() * jokes.length);
        let joke = jokes[rand];
        if (rand !== 69)
          send(joke.replace(/\/{3}/, "\n"));
      } else if (isNaN(Number(args[0])) === false){
        if (Number(args[0]) === 69) {
          return;
        }
        let joke = jokes[Number(args[0]) - 1];
        if (joke) {
          send(joke.replace(/\/{3}/, "\n"));
        } else {
          send("People who think the bot has an unlimited number of jokes.");
        }
      }
    }
  }
}

function getGrave(query, graves) {
  for (let g of graves) {
    if (g.grave_name === query) return g;
    for (let n of g.names) {
      if (n === query) return g;
    }
    if (g.nick === query) return g;
  }
  return null;
}

/**Returns a function that displays graves.
 * @params {Array} graves The graves to use.
 * @returns {Function}
 * **/
function gravesCreator(graves) {
  return (args, send, server) => {
    if (server.rao) {
      let name = args.join(" ").toLowerCase();
      let grave = getGrave(name, graves);
      if (grave) {
        send(utils.generateGrave(grave.grave_name, grave.nick, grave.epit));
      }
    }
  }
}
/**Given a response from SteamCommunity.marketSearch, translate into human
 * readable text.
 * @param {Array} prices The response from SteamCommunity.marketSearch()
 * @returns {String}
 * **/
function formatPrice(prices) {
  let ret = "";
  for (let i = 0; i < (prices.length < 5 ? prices.length : 5); i++) {
    ret += prices[i].market_hash_name + " costs $" + (prices[i].price / 100) + "\n";
  }
  return ret;
}


function replaceWear(text) {
  return text.replace(/(?:^| )[fF][nN](?: |$)/g, " Factory New").replace(/(?:^| )[mM][wW](?: |$)/g, " Minimal Wear")
      .replace(/(?:^| )[fF][tT](?: |$)/g, " Field-Tested").replace(/(?:^| )[wW][wW](?: |$)/g, " Well-Worn")
      .replace(/(?:^| )[bB][sS](?: |$)/g, " Battle-Scarred");
}

/**Searches the Steam Community Market for prices.
 * @param {SteamCommunity} community The initialized SteamCommunity object
 * @param {String} item The search query
 * @param {Number} appid The Steam AppID of the game to search for
 * @param {Function} callback
 * **/

function getPrice(community, item, appid, callback) {
  community.marketSearch({
    query: replaceWear(item),
    appid
  }, (err, items) => {
    if (err) {
      callback(err.message);
    } else {
      callback(formatPrice(items));
    }
  })
}

/**Returns a function that checks the SCM for prices.
 *
 * **/

function priceOfCreator(community) {
  return (args, send, server) => {
    if (server.rao) {
      let name = args.join(" ");
      getPrice(community, name, 730, send);
    }
  }
}

module.exports = {
  whoIsCreator,
  jokesCreator,
  gravesCreator,
  priceOfCreator
};
const wow = require("./wowapi.js");

function progCreator(realm, key) {
  return (args, send, server) => {
    if (server.atg) {
      let name = wow.argsToNameAndRealm(args, realm);
      if (name[0] !== "" && name[1] !== "") {
        wow.getCharacterProgressionData(key, (data, err) => {
          if (err) {
            send(err);
          } else {
            let progData = wow.getProgressionData(data, ["Uldir"], ["Uld"]);
            send(wow.prettyProg(progData, ["Uldir"], ["Uld"], name[1], name[0]));
          }
        }, name[1], name[0]);
      }
    }
  }
}

function tokenCreator(token) {
  return (args, send, server) => {
    if (server.atg) {
      wow.getWowTokenPrice(token, send);
    }
  }
}

class WowAPI {
  constructor() {

  }

}

module.exports = {
  progCreator,
  tokenCreator,
  WowAPI
};
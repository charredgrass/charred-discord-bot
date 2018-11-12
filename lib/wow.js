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
  /**Create a WoW API object.
   * @param {string} id
   * @param {string} secret
   */
  constructor(id, secret) {
    this.id = id;
    this.secret = secret;
    this.token = null;
    this.queue = [];
    this.whatAmI = "an API object"
    this.refreshToken()
  }

  /**
   * Query the API again for a new OAuth token.
   * @param {function?} cb Optional. Called when finished.
   */
  refreshToken(cb) {
    this.token = null;
    wow.getOAuthToken(this.id, this.secret, (token) => {
      this.token = token;
      if (cb)
        cb(token);
    });
  }

  getWowTPriceCreator() {
    return (args, send, server) => {
      if (server.atg) {
        if (this.token) {
          wow.getWowTokenPrice(this.token, send, (err) => {
            console.log(err);
            console.log(this.token);
            this.refreshToken((t) => {
              wow.getWowTokenPrice(t, send, console.log);
            });
          })
        }
      }
    }
  }

  // getWowTPrice(args, send, server) {
  //   if (server.atg) {
  //     if (this.token) {
  //       wow.getWowTokenPrice(this.token, send, (err) => {
  //         console.log(err);
  //         console.log(this.token);
  //         this.refreshToken((t) => {
  //           wow.getWowTokenPrice(t, send, console.log);
  //         });
  //       })
  //     }
  //   }
  // }


}

module.exports = {
  progCreator,
  tokenCreator,
  WowAPI
};
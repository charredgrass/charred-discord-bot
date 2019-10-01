const wow = require("./wowapi.js");

class WowAPI {
  /**Create a WoW API object.
   * @param {string} id
   * @param {string} secret
   * @param {string} realm The server name to pass to the API.
   */
  constructor(id, secret, realm) {
    this.id = id;
    this.secret = secret;
    this.realm = realm;
    this.token = null;
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

  /**
   * Creates a function that relays the token price to chat.
   * @returns {function} The generated function.
   */
  getWowTPriceCreator() {
    return (args, send, server) => {
      if (server.atg) {
        if (this.token) {
          wow.getWowTokenPrice(this.token, send, (err) => {
            this.refreshToken((t) => {
              wow.getWowTokenPrice(t, send, console.log);
            });
          })
        }
      }
    }
  }

  /**
   * Creates a function that calls the API for progression
   * data and relays it to chat.
   * @returns {function} The generated function.
   */
  getProgCreator() {
    const RAIDS = ["Uldir", "Battle of Dazar'alor", "Crucible of Storms", "The Eternal Palace"];
    const ABBRVS = ["Uld", "BoD", "CoS", "EP "];
    return (args, send, server) => {
      if (server.atg) {
        if (this.token) {
          let name = wow.argsToNameAndRealm(args, this.realm);
          if (name[0] !== "" && name[1] !== "") {
            wow.getCharacterProgressionData(this.token, (data, err) => {
              if (err) {
                this.refreshToken((t) => {
                  let name = wow.argsToNameAndRealm(args, this.realm);
                  if (name[0] !== "" && name[1] !== "") {
                    wow.getCharacterProgressionData(t, (data, err) => {
                      if (err) {
                        send(err);
                      } else {
                        let progData = wow.getProgressionData(data, RAIDS, ABBRVS);
                        send(wow.prettyProg(progData, RAIDS, ABBRVS, name[1], name[0]));
                      }
                    }, name[1], name[0]);
                  }
                })
              } else {
                let progData = wow.getProgressionData(data, RAIDS, ABBRVS);
                send(wow.prettyProg(progData, RAIDS, ABBRVS, name[1], name[0]));
              }
            }, name[1], name[0]);
          }
        }
      }
    }
  }
}

module.exports = {
  WowAPI
};
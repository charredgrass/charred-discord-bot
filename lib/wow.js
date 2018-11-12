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

class WowAPI {
  /**Create a WoW API object.
   * @param {string} id
   * @param {string} secret
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

  getProgCreator() {
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
                        let progData = wow.getProgressionData(data, ["Uldir"], ["Uld"]);
                        send(wow.prettyProg(progData, ["Uldir"], ["Uld"], name[1], name[0]));
                      }
                    }, name[1], name[0]);
                  }
                })
              } else {
                let progData = wow.getProgressionData(data, ["Uldir"], ["Uld"]);
                send(wow.prettyProg(progData, ["Uldir"], ["Uld"], name[1], name[0]));
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
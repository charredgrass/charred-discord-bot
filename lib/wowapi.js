const request = require("request");

/** Call the WoW API.
 * @param {String} url
 * @param {String} token
 * @param {String} cb
 * @param {Function} errcb
 */
function callAPI(url, token, cb, errcb) {
  try {
    request(url + token, cb);
  } catch (err) {
    errcb("WoWAPIError: " + err.message);
  }
}


function base64(toEncode) {
  return Buffer.from(toEncode).toString("base64");
}

function getWowTokenPrice(token, cb, ecb) {
  const base_URL = "https://us.api.blizzard.com/data/wow/token/?namespace=dynamic-us&locale=en_US&access_token=";
  callAPI(base_URL, token, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const val = Number(JSON.parse(body).price);
      cb("WoW Token is worth " + parseInt(val / 10000) + "g on US servers");
    } else {
      if (error) {
        ecb("WoWTokenError: " + error.msg);
      } else {
        ecb("WoW Token: received response code" + response.statusCode);
      }
    }
  }, console.log);
}

function getCharacterProgressionData(key, cb, realm, character) {
  const base_URL = "https://us.api.blizzard.com/wow/character/" + realm + "/" + character + "?fields=progression&locale=en_US&access_token=";
  callAPI(base_URL, key, (error, response, body) => {
    if (response.statusCode === 404) {
      cb(null, "Error: Character not found.");
    }
    if (!error && response.statusCode === 200) {
      cb(JSON.parse(body));
    } else {
      if (error) {
        console.log("WoWAPIError: " + error.msg);
      } else {
        console.log("WoWAPIError: HTTP Error" + response.statusCode);
      }
    }
  }, console.log);
}

function getProgressionData(chardata, names, abbrevs) {
  let raids = chardata.progression.raids;
  let ret = new Array(names.length);
  let nbii = new Array(names.length); //number of bosses in instance
  for (let i = 0; i < names.length; i++) { //iterate over the expac's raids
    for (let j = 0; j < raids.length; j++) { //iterate over all the raid progression things
      if (raids[j].name === names[i]) {
        const DIFFS = ["lfrKills", "normalKills", "heroicKills", "mythicKills"];
        ret[i] = [0, 0, 0, 0]; //LFR-N-H-M
        nbii[i] = raids[j].bosses.length;
        for (let k = 0; k < raids[j].bosses.length; k++) {
          for (let dn = 0; dn < DIFFS.length; dn++) {
            // console.log(raids[j].bosses[k]);
            if (raids[j].bosses[k][DIFFS[dn]] > 0) { //if the number of kills on the difficulty is non-zero
              ret[i][dn]++;
            }
          }
        }
        break;
      }
    }
  }
  return {
    kills: ret,
    outof: nbii
  };
}

function formatProgNum(num) {
  if (num <= 9) {
    return " " + String(num);
  } else {
    return String(num);
  }
}

function prettyProg(prog, names, abbrevs, realm, character) {
  let ret = "Progression for " + character + "-" + realm + "\n";
  ret += "```\n";
  ret += "   | LFR |  N  |  H  |  M  \n";
  for (let i = 0; i < abbrevs.length; i++) {
    ret += abbrevs[i];
    for (let j = 0; j < 4; j++) {
      ret += "|" + formatProgNum(prog.kills[i][j]) + "/" + formatProgNum(prog.outof[i]);
    }
    ret += "\n";
  }
  ret += "\n```";
  if (prog.kills[0][3] > 0) {
    ret += "(mythic raider btw)";
  }
  return ret;
}

function argsToNameAndRealm(args, HOMEREALM) {
  let toon, realm;
  if (args.length === 2) {
    toon = args[0];
    realm = args[1];
  } else if (args.length === 1 && args[0].includes("-") === true) {
    let temp = args[0].split("-");
    toon = temp[0];
    realm = temp[1];
  } else if (args.length === 1) {
    toon = args[0];
    realm = HOMEREALM;
  }
  return [toon, realm];
}

function getOAuthToken(clientID, clientSecret, cb) {
  const baseURI = "https://us.battle.net/oauth/token";
  request.post({
        url: baseURI,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "Authorization": "Basic " + base64(clientID + ":" + clientSecret)
        },
        form: {
          "grant_type": "client_credentials",
          "client_id": clientID,
          "client_secret": clientSecret
        }
      },
      (err, resp, body) => {
        if (err) {
          console.log(err);
        } else {
          cb(JSON.parse(body).access_token);
        }
      });
}

module.exports = {
  getWowTokenPrice,
  getCharacterProgressionData,
  getProgressionData,
  prettyProg,
  argsToNameAndRealm,
  getOAuthToken
};
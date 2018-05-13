const http = require("./http.js");

function getGame(appid, cb) {
  http.get("http://store.steampowered.com/api/appdetails/?appids=" + appid, (err, body) => {
    if (err) {
      cb(err);
    } else {
      cb(null, body);
    }
  });
}


//cleanGameDetails
//jsresp is an object
function cleanGameDetails(jsresp) {
  let tarGame;
  const check = "✅";
  const cross = "❌";
  for (var n in jsresp) {
    tarGame = jsresp[n];
    break;
  }
  if (tarGame.success === false) {
    return "Error: Steam failed.";
  }
  let d = tarGame.data;
  let ret = "";
  ret += d.name + "\n";
  ret += "Type: " + d.type + ", AppID: " + d.steam_appid + ", ";
  ret += "Free: " + (d.is_free ? check : cross) + "\n";
  ret += "Developer" + (d.developers.length == 1 ? "" : "s") + ": " + d.developers.join(", ") + "\n";
  if (d.price_overview) {
    ret += "Price: " + (d.price_overview.final / 100) + " " + d.price_overview.currency + (d.price_overview.discount_percent > 0 ? " (" + d.price_overview.discount_percent + "% off " + (d.price_overview.initial / 100) + ")" : "") + "\n";
  }
  ret += "Platforms: ";
  for (var m in d.platforms) {
    ret += m + " " + (d.platforms[m] === true ? check : cross) + " ";
  }
  ret += "\n";
  if (d.metacritic) {
    ret += "Metacritic: " + d.metacritic.score + " ";
  }

  if (d.achievements) {
    ret += "Achievements: " + d.achievements.total + " ";
  }
  if (d.release_date) {
    ret += "Release Date: " + d.release_date.date + " ";
  }
  ret += "\nhttp://store.steampowered.com/app/" + d.steam_appid;
  return ret;
}

function getGameSummary(appid, cb) {
  getGame(appid, (err, body) => {
    if (!err) {
      cb(cleanGameDetails(body));
    } else {
      cb("Error: Could not retrieve data.");
    }
  });
}

module.exports = {
  getGameSummary
};
const Discord = require('discord.js');
const client = new Discord.Client();

const SteamCommunity = require('steamcommunity');
var community = new SteamCommunity();

const fs = require('fs');

const gamemod = require('./lib/game_utils.js');
const steamgame = require('./lib/steamgame.js');
const utils = require('./lib/utils.js');
const hascmd = utils.hascmd;
const slots = require('./lib/slots.js');

var whoppl = JSON.parse(fs.readFileSync('./texts/whois.json').toString("utf-8"));

const hiddenppl = {
  "god": "me",
  "england": "my city"
};

var everyone = Object.keys(whoppl).join(", ");
var helpdocs = JSON.parse(fs.readFileSync('./texts/helpdocs.json').toString("utf-8"));
var jokes = (fs.readFileSync('./texts/jokes.txt').toString("utf-8").split("\n"));
for (let i = 0; i < jokes.length; i++) {
  while (jokes[i].includes("///"))
    jokes[i] = jokes[i].replace("///", "\n");
}
var graves = JSON.parse(fs.readFileSync('./texts/graves.json').toString("utf-8"));

var gamedata = JSON.parse(fs.readFileSync("./game_data.json"));
var ghandler = new gamemod.GameData(gamedata);

var emojiHolder;

process.stdin.setEncoding('utf8');
var commands = {
  "UNKNOWN_COMMAND": function() {
    return "Unknown command. Type `help` for help.";
  },
  "reload": function() {
    whoppl = JSON.parse(fs.readFileSync('./texts/whois.json').toString("utf-8"));
    everyone = Object.keys(whoppl).join(", ");
    helpdocs = JSON.parse(fs.readFileSync('./texts/helpdocs.json').toString("utf-8"));
    jokes = (fs.readFileSync('./texts/jokes.txt').toString("utf-8").split("\n"));
    for (let i = 0; i < jokes.length; i++) {
      while (jokes[i].includes("///"))
        jokes[i] = jokes[i].replace("///", "\n");
    }
    return "Reloaded.";
  },
  "test": function() {
    console.log(jokes.join("\n"));
    return "yep";
  },
  "stop": function() {
    fs.writeFileSync("./game_data.json", ghandler.dataToSave());
    process.exit(0);
    return "Stopping.";
  }
};
var anchorloc;
process.stdin.on('data', (text) => {
  var stuff;
  while (text.indexOf('\n') !== -1 || text.indexOf('\r') !== -1 || text.indexOf('  ') !== -1) {
    text = text.replace(/\n|\r|\t/, '').replace(/  /, ' ');
  }
  var args = text.split(' ');
  var command = args[0].toLowerCase();
  var trip = false;
  for (var key in commands) {
    if (key === command) {
      trip = true;
      stuff = commands[key](args[1], args[2], args[3]);
      if (Array.isArray(stuff)) {} else {
        console.log(stuff);
      }
    }
  }
  if (!trip) {
    stuff = commands.UNKNOWN_COMMAND();
    if (Array.isArray(stuff)) {
      for (var i = 0; i < stuff.length; i++) {
        console.log(stuff[i]);
      }
    } else {
      console.log(stuff);
    }
  }
});

function whois(person) {
  let trueppl = Object.assign({}, whoppl, hiddenppl);
  for (var key in trueppl) {
    if (person.toLowerCase() === key) {
      return person + " is " + trueppl[key];
    }
  }
}



client.on('ready', () => {
  console.log('Connected and initialized.');
});

function formatPrice(prices) {
  let ret = "";
  for (var i = 0; i < (prices.length < 5 ? prices.length : 5); i++) {
    ret += prices[i].market_hash_name + " costs $" + (prices[i].price / 100) + "\n";
  }
  return ret;
}

function getPrice(item, appid, cb) {
  community.marketSearch({
    query: item,
    appid
  }, (err, items) => {
    if (err) {
      cb(err.message);
    } else {
      cb(formatPrice(items));
    }
  });
}

function getImg(item, appid, cb, ecb) {
  if (item.toLowerCase() == "kairu") {
    cb("http://vignette1.wikia.nocookie.net/powerlisting/images/a/ad/Trap-image.png/revision/latest?cb=20160113212524");
    return;
  } else if (item.toLowerCase() == "livid") {
    cb("https://s.thestreet.com/files/tsc/v2008/photos/contrib/uploads/transoceanrig_600x400.jpg");
    return;
  } else if (item.toLowerCase() == "dank") {
    cb("http://st.motortrend.com/uploads/sites/10/2015/11/2015-nissan-juke-sl-suv-angular-front.png?interpolation=lanczos-none&fit=around|300;199");
    return;
  } else if (item.toLowerCase() == "yuna") {
    cb("http://i.imgur.com/5vDmod7.png");
    return;
  } else if (item.toLowerCase() == "abuse") {
    cb("https://cdn.discordapp.com/attachments/167586953061990400/364157623832150017/madman.png");
  } else if (item.toLowerCase() == "tato") {
    cb("https://cdn.discordapp.com/attachments/318187405335068675/369579039884836865/tato.jpg");
  }
  community.marketSearch({
    query: item,
    appid: appid
  }, (err, items) => {
    if (err) {
      ecb(err.message);
    } else {
      cb(items[0].image, items[0].market_hash_name);
    }
  });
}

function removeAll(str, rep) {
  while (str.includes(rep) === true) {
    str = str.replace(rep, "");
  }
  return str;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomFromList(list) {
  return list[getRandomInt(0, list.length)];
}

function game(args, user, send, mens, name, autoInit) {
  if (ghandler.playerExists(user) === false) {
    if (autoInit === true) {
      ghandler.newPlayer(user, name);
    } else {
      send("See !game help for help.");
      return
    }
  }
  if (args[0] === "balance") {
    if (args[1] && mens[0]) {
      send(ghandler.getBalOf(mens[0].id));
    } else {
      send(ghandler.getBalOf(user));
    }
  }
  if (args[0] === "free") {
    ghandler.refill(user, send);
  }
  if (args[0] === "give" && args[1] && args[2]) {
    if (mens[0]) {
      let person = mens[0].id;
      let amt = Number(args[2]);
      if (Number.isNaN(amt) || amt <= 0) {
        return;
      } else {
        amt = parseInt(amt);
        ghandler.send(user, person, amt, send);
      }
    }
  }
  if (args[0] === "coinflip" && args[1]) {
    if (args[1] === "allin") {
      ghandler.setBalOf(user, 0);
      send("Woah, we got a high roller here...\nYou lose. You now have 0 credits.");
      return;
    }
    let amt = Number(args[1]);
    if (Number.isNaN(amt) || amt < 0) {
      return;
    } else {
      amt = parseInt(amt);
      let m = parseInt(ghandler.getBalOf(user));
      if (amt > m) {
        send("No.");
        return;
      }
      let res = getRandomInt(0, 2);
      if (res === 0) {
        ghandler.setBalOf(user, m + amt);
        send("You win. You now have " + (m + amt) + " credits.");
      } else {
        ghandler.setBalOf(user, m - amt);
        if (parseInt(m - amt) === 0) {
          send("You lose! Haha, look at this goofball who lost everything.");
        } else {
          send("You lose. You now have " + (m - amt) + " credits.");
        }
      }
    }
  }
  if (args[0] === "leaderboard") {
    send(ghandler.getLeaderboard(10));
  }
  if (args[0] === "loserboard") {
    send(ghandler.getLoserboard(10));
  }
  if (args[0] === "admin" && user === "154826263628873728") {
    if (args[1] === "set") {
      let person = args[2];
      let amt = Number(args[3]);
      if (Number.isNaN(amt)) {
        return;
      }
      ghandler.setBalOf(person, amt);
    }
    if (args[1] === "sm") {
      let person = mens[0].id;
      let amt = Number(args[3]);
      if (Number.isNaN(amt)) {
        return;
      }
      ghandler.setBalOf(person, amt);
    }
    if (args[1] === "save") {
      fs.writeFileSync("./game_data.json", ghandler.dataToSave());
    }
    if (args[1] == "leaderboard") {
      send(ghandler.getLeaderboard(9999999));
    }
    if (args[1] == "freefill") {
      let person = mens[0].id;
      ghandler.freefill(person);
    }
  }
  if (args[0] == "blackjack") {
    let amt = Number(args[1]);
    if (Number.isNaN(amt) || amt < 0) {
      return;
    } else {
      amt = parseInt(amt);
      ghandler.startGame(user, "blackjack", amt, send);
    }
  }
  if (args[0] == "hit") {
    ghandler.moveGame(user, ["hit"], send);
  }
  if (args[0] == "stand") {
    ghandler.moveGame(user, ["stand"], send);
  }
  if (args[0] == "testspin") {
    let amt = Number(args[1]);
    if (Number.isNaN(amt) || amt <= 0 || amt > 1000000) {
      return;
    } else {
      amt = parseInt(amt);
      let n = slots.fullSpin(amt);
      send(n.str);
    }
  }
  if (args[0] == "slots") {
    let amt = Number(args[1]);
    if (Number.isNaN(amt) || amt <= 0) {
      return;
    } else {
      amt = parseInt(amt);
      ghandler.slots(user, amt, send);
    }
  }
}

var lastsent = Date.now();

setInterval(() => {
  fs.writeFileSync("./game_data.json", ghandler.dataToSave());
}, 1000 * 60 * 30);



client.on('message', message => {

  if (message.author.bot === true) {
    return;
  }

  // if (!emojiHolder) {
  //   emojiHolder = utils.getAllEmoji(message.guild);
  // }

  var loc = message.channel;
  var msg = removeAll(message.content, "?");

  let send = function(msg, opts) {
    if (lastsent + 1000 < Date.now()) {
      lastsent = Date.now();
      loc.send(msg, opts);
    } else {

    }
  };

  let sgame = function(msg, opts) {
    lastsent = Date.now();
    let ismod = false;
    for (let i = 0; i < mroles.length; i++) {
      if (mroles[i].name.includes("Mod")) {
        ismod = true;
      }
    }
    if (message.channel.name == "general" && ismod == false) {
      return;
    }
    loc.send(msg, opts);
  };

  let sendimg = function(img, text) {
    send(text, {
      embed: new Discord.RichEmbed().setImage(img)
    });
  };
  let mroles = [];
  if (message.member) {
    mroles = message.member.roles.array();
  }
  let ismod = false;
  for (let i = 0; i < mroles.length; i++) {
    if (mroles[i].name.includes("Mod")) {
      ismod = true;
    }
  }

  if (msg == "!info") {
    send("I'm a bot run by Charred. https://github.com/charredgrass/raocsgo-discord-bot");
  }
  if (msg == "!ping") {
    send("Pong.");
  }
  if (msg.toLowerCase().match(/([^a-zA-Z]|^)osu/)) {
    send("We get it, you're a weeb.");
  }
  if (msg.toLowerCase() === "!whatthefuck" || msg.toLowerCase() === "!what") {
    send("https://docs.google.com/document/d/1u0-YAZG7Rv7P9N94vKEGocvJccGlDvK2RZxWMcg8pDA/edit?usp=sharing");
  }
  if (msg.toLowerCase().includes("trap")) {
    send('Traps? Ask Kairu about our Grade A Traps today!');
  }
  if (msg.toLowerCase() === "who am i") {
    send("None of your business.");
  }
  if (msg.toLowerCase() === "what is love") {
    send("Something you'll never feel.");
  }
  if (msg.toLowerCase() === "who are you" || msg.toLowerCase() === "who is bot charred") {
    send("You're fucking retarded.");
    return;
  }
  if (msg.toLowerCase() === "who is 为什么" || msg.toLowerCase() === "who is weishenme") {
    send("\"为什么\"是小孩子");
    return;
  }
  if (msg.toLowerCase() === "who is your daddy") {
    send("Charred is my daddy");
    return;
  }
  if (msg.substring(0, "who is everyone".length).toLowerCase() === "who is everyone") {
    send(everyone + ", 为什么");
  }
  if (msg.substring(0, "who is ".length).toLowerCase() === "who is ") {
    send(whois(msg.substring("who is ".length)));
  }
  if (msg.toLowerCase().includes("what is gambl")) {
    send("gamble is bad");
  }
  if (msg.toLowerCase() === "!source" || msg.toLowerCase() === "!sauce") {
    send("https://github.com/charredgrass/raocsgo-discord-bot");
  }
  if (msg.toLowerCase() === "!source2") {
    send("never");
  }
  // if (msg.toLowerCase() === "!test") {
  //   send(utils.generateGrave("Camaron","","\"!joke 18\" ","      -Charred","",""))
  // }
  if (msg.substring(0, "!joke".length).toLowerCase() === "!joke") {
    if (msg.split(" ").length > 1) {
      let x = parseInt(msg.substring("!joke ".length));
      if (x && x - 1 < jokes.length) {
        if (x == 69) {
          // send("")
        } else if (x == 0) {
          send("People who think arrays start at 1");
        } else {
          send(jokes[x - 1]);
        }
      } else if (x && x != 69) {
        send("People who think the bot has an unlimited number of jokes.");
      }
    } else {
      send(getRandomFromList(jokes));
    }
  }
  if (msg === "!jokes") {
    send("https://github.com/charredgrass/raocsgo-discord-bot/blob/master/texts/jokes.txt");
  }
  if (msg.substring(0, "!anchorloc".length).toLowerCase() === "!anchorloc") {
    anchorloc = loc;
    message.delete();
  }
  if (msg.substring(0, "!proxy".length).toLowerCase() === "!proxy") {
    if (message.author.id == "154826263628873728") {
      let toSay = msg.substring("!proxy ".length);
      if (anchorloc) {
        anchorloc.send(toSay);
      }
    }
  }
  if (hascmd(msg, "priceof")) {
    getPrice(msg.substring("!priceof ".length), 730, send);
  }
  if (hascmd(msg, "priceofdota")) {
    getPrice(msg.substring("!priceofdota ".length), 570, send);
  }
  if (hascmd(msg, "priceoftf")) {
    getPrice(msg.substring("!priceoftf ".length), 440, send);
  }
  if (hascmd(msg, "priceofpubg")) {
    getPrice(msg.substring("!priceofpubg ".length), 578080, send);
  }
  if (hascmd(msg, "imgof")) {
    getImg(msg.substring("!imgof ".length), 730, sendimg, send);
  }
  if (hascmd(msg, "imgofpubg")) {
    getImg(msg.substring("!imgofpubg ".length), 578080, sendimg, send);
  }
  if (hascmd(msg, "magic8")) {
    var answers = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
    send(getRandomFromList(answers));
  }
  if (hascmd(msg, "steam")) {
    try {
      steamgame.getGameSummary(msg.substring("!steam ".length), send);
    } catch (err) {
      console.log(err.message)
    }
  }
  if (hascmd(msg, "help")) {
    let args = utils.argify(msg, "help")
    if (args.length === 0) {
      send("Valid commands: !help, !what, !priceof, !imgof, who is [person], !magic8, !info\nType \"!help help\" for more specific help.");
      if (helpdocs[args[0]]) {
        send(helpdocs[args[0]]);
      }
    } else {
      send("Unknown command. Type \"!help\" for help.");
    }
  }
  if (message.channel.name == "game" && msg.substring(0, "g ".length).toLowerCase() === "g ") {
    let args = utils.clearEmptyArgs(msg.substring("g".length).split(" "));
    if (args[0] == "help") {
      send("See the full list of commands here: https://github.com/charredgrass/raocsgo-discord-bot/blob/master/docs/game.md");
      return;
    }
    for (let i = 0; i < args.length; i++) {
      if (args[i] == "bj") args[i] = "blackjack";
      if (args[i] == "cf") args[i] = "coinflip";
      if (args[i] == "h") args[i] = "hit";
      if (args[i] == "s") args[i] = "stand";
      if (args[i] == "b") args[i] = "balance";
      if (args[i] == "lb") args[i] = "leaderboard";
    }
    if (args[0] == "f" && args.length == 1) {
      send("GFs owned: 0. Because you're a fucking loser.");
      return;
    }
    game(args, message.author.id, sgame, message.mentions.users.array(), message.author.username, false);
  }
  if (hascmd(msg, "game")) {
    let args = utils.argify(msg, "game");
    if (args[0] == "help") {
      send("See the full list of commands here: https://github.com/charredgrass/raocsgo-discord-bot/blob/master/docs/game.md");
      return;
    }
    game(args, message.author.id, sgame, message.mentions.users.array(), message.author.username, true);
  }
  if (hascmd(msg, "grave")) {
    let arg = msg.substring("!grave ".length);
    if (arg.toLowerCase() == "help") {
      send("A tribute to the permanently banned users of RAOfCSGO, or the ones who have abandoned us. Use `!grave list` for a list of all the tombstones.");
      return;
    }
    if (arg.toLowerCase() == "list") {
      let hold = [];
      for (let i = 0; i < graves.length; i++) {
        hold.push(graves[i].grave_name);
      }
      send(hold.join(", "));
      return;
    }
    for (let i = 0; i < graves.length; i++) {
      for (let j = 0; j < graves[i].names.length; j++) {
        if (arg.toLowerCase() == graves[i].names[j]) {
          send(utils.generateGrave(graves[i].grave_name, graves[i].nick, graves[i].epit));
          return;
        }
      }
    }
  }
});



client.login(fs.readFileSync('./key.txt').toString("utf-8"));
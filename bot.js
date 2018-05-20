//Importing node.js modules
const Discord = require("discord.js");
const SteamCommunity = require("steamcommunity");
const fs = require("fs");

//Instantiating module objects
const client = new Discord.Client();
var community = new SteamCommunity();

//Importing my own files
const gamemod = require("./lib/game_utils.js");
const steamgame = require("./lib/steamgame.js");
const utils = require("./lib/utils.js");
const timer = require("./lib/timer.js");
const slots = require("./lib/slots.js");
const wow = require("./lib/wowapi.js");
const lbh = require("./lib/lb_archive.js");
const dnd = require("./lib/dnd.js");

//assigning these just so I don't need to type them out
const hascmd = utils.hascmd;
const argify = utils.argify;
const flagify = utils.flagify;

//read API keys from file. File is .gitignore-d
let keyholder = fs.readFileSync("./token.txt").toString("utf-8").split(" ");
const TOKEN = keyholder[0];
const WOWKEY = keyholder[1];

//Bad, hard coded constants
const HOMEREALM = "Undermine";
const hiddenppl = {
  "god": "me",
  "england": "my city"
};

//read more data from file
var whoppl = JSON.parse(fs.readFileSync("./texts/whois.json").toString("utf-8"));
var everyone = Object.keys(whoppl).join(", ");
var helpdocs = JSON.parse(fs.readFileSync("./texts/helpdocs.json").toString("utf-8"));
var jokes = (fs.readFileSync("./texts/jokes.txt").toString("utf-8").split("\n"));
for (let i = 0; i < jokes.length; i++) {
  while (jokes[i].includes("///"))
    jokes[i] = jokes[i].replace("///", "\n");
}
var graves = JSON.parse(fs.readFileSync("./texts/graves.json").toString("utf-8"));
var gamedata = JSON.parse(fs.readFileSync("./data/game_data.json"));

//instantiate objects from my own code that require external files1
var ghandler = new gamemod.GameData(gamedata);
var archive = new lbh.LBArchive("./data/archives/", 1);

//start reading from stdin and set up event listener for commands
process.stdin.setEncoding("utf8");
var commands = {
  "UNKNOWN_COMMAND": function() {
    return "Unknown command. Type `help` for help.";
  },
  "reload": function() {
    whoppl = JSON.parse(fs.readFileSync("./texts/whois.json").toString("utf-8"));
    everyone = Object.keys(whoppl).join(", ");
    helpdocs = JSON.parse(fs.readFileSync("./texts/helpdocs.json").toString("utf-8"));
    jokes = (fs.readFileSync("./texts/jokes.txt").toString("utf-8").split("\n"));
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
    fs.writeFileSync("./data/game_data.json", ghandler.dataToSave());
    process.exit(0);
    return "Stopping.";
  }
};
process.stdin.on("data", (text) => {
  let stuff;
  while (text.indexOf("\n") !== -1 || text.indexOf("\r") !== -1 || text.indexOf("  ") !== -1) {
    text = text.replace(/\n|\r|\t/, "").replace(/ {2}/, " ");
  }
  let args = text.split(" ");
  let command = args[0].toLowerCase();
  let trip = false;

  if (commands.hasOwnProperty(command) === true) {
    trip = true;
    stuff = commands[command](...args);
    if (Array.isArray(stuff) === false) {
      console.log(stuff);
    }
  } else {
    stuff = commands.UNKNOWN_COMMAND();
    if (Array.isArray(stuff) === true) {
      console.log(JSON.stringify(stuff));
    } else {
      console.log(stuff);
    }
  }
});

//Global variables
//I know...
var anchorloc;
var timerobj;

//Event listener to trigger when bot starts
client.on("ready", () => {
  console.log("Connected and initialized.");
});

//Helper functions for chat commands

function whois(person) {
  let trueppl = Object.assign({}, whoppl, hiddenppl);
  if (trueppl.hasOwnProperty(person.toLowerCase()) === true) {
    return person + " is " + trueppl[person.toLowerCase()];
  } else {
    return "";
  }
}

function formatPrice(prices) {
  let ret = "";
  for (var i = 0; i < (prices.length < 5 ? prices.length : 5); i++) {
    ret += prices[i].market_hash_name + " costs $" + (prices[i].price / 100) + "\n";
  }
  return ret;
}

function replacify(text) {
  return text.replace(/(?:^| )[fF][nN](?: |$)/g, " Factory New").replace(/(?:^| )[mM][wW](?: |$)/g, " Minimal Wear")
    .replace(/(?:^| )[fF][tT](?: |$)/g, " Field-Tested").replace(/(?:^| )[wW][wW](?: |$)/g, " Well-Worn")
    .replace(/(?:^| )[bB][sS](?: |$)/g, " Battle-Scarred");
}

function getPrice(item, appid, cb, flags, debug) {
  community.marketSearch({
    query: replacify(item),
    appid
  }, (err, items) => {
    if (err) {
      if (debug) {
        cb(err.message + "\nDebug: " + replacify(item));
      } else {
        cb(err.message);
      }
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
  } else if (item.toLowerCase() == "daka") {
    cb("https://cdn.discordapp.com/attachments/308936393999253505/410292836509024256/Screenshot_20180204-092453.png");
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
      send("See !game help for help. Note: You can't use shortened commands without first using a full one. Try `!game balance`.");
      return;
    }
  }
  if (ghandler.canMessAgain(user) === true) {
    ghandler.newMess(user);
  } else {
    return;
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
        ghandler.addKarma(user, amt);
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
      fs.writeFileSync("./data/game_data.json", ghandler.dataToSave());
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
  if (args[0] == "archive") {
    let seas = Number(args[1]);
    if (Number.isNaN(seas) || seas <= 0) {
      return;
    } else {
      send(archive.seasonLB(seas));
    }
  }
}

var lastsent = Date.now();

setInterval(() => {
  fs.writeFileSync("./data/game_data.json", ghandler.dataToSave());
}, 1000 * 60 * 30);


//Main event listener for messages
client.on("message", message => {

  //ignore other bots
  if (message.author.bot === true) {
    return;
  }

  //shorthand
  var loc = message.channel;
  var msg = removeAll(message.content, "?");

  //Role Fillers
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

  //SEND helper functions
  let send = function(msg, opts) {
    lastsent = Date.now();
    loc.send(msg, opts);
  };
  let sgame = function(msg, opts) {
    lastsent = Date.now();
    let ismod = false;
    for (let i = 0; i < mroles.length; i++) {
      if (mroles[i].name.includes("Mod")) {
        ismod = true;
      }
    }
    if (message.channel.name == "general" && ismod === false) {
      return;
    }
    loc.send(msg, opts);
  };
  let sendimg = function(img, text) {
    send(text, {
      embed: new Discord.RichEmbed().setImage(img)
    });
  };

  //Server Selector
  let server = null;
  if (loc.guild) {
    server = loc.guild.id; //"guild" and "server" are the same thing
  }
  let shouldResp = {
    rao: false,
    atg: false,
    frz: false,
    dnd: false
  };
  if (server == "313169519545679872" || server === null) { //NASS Test Server or a DMChannel
    shouldResp.rao = true;
    shouldResp.atg = true;
    shouldResp.frz = true;
    shouldResp.dnd = true;
  }
  if (server == "167586953061990400") { //RAOCSGO
    shouldResp.rao = true;
  }
  if (server == "276220128822165505") { //AtG
    shouldResp.atg = true;
  }
  if (server == "234382619767341056") { //Frozen
    shouldResp.frz = true;
  }
  if (server == "446813545049358336") { //D&D
    shouldResp.dnd = true;
  }

  //Global Commands
  if (msg == "!info") {
    if (shouldResp.rao === true || shouldResp.frz === true) {
      send("I'm a bot run by Charred. https://github.com/charredgrass/raocsgo-discord-bot");
    } else {
      send("I'm a bot run by Bairac. https://github.com/charredgrass/raocsgo-discord-bot");
    }
  }
  if (msg == "!ping") {
    send("Pong.");
  }
  if (msg.toLowerCase() === "!source" || msg.toLowerCase() === "!sauce") {
    send("https://github.com/charredgrass/raocsgo-discord-bot");
  }
  if (msg == "!amigay") {
    send("yea");
  }

  if (hascmd(msg, "magic8")) {
    var answers = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
    send(getRandomFromList(answers));
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

  //RAO Commands
  if (shouldResp.rao === true) {
    if (msg.toLowerCase().match(/([^a-zA-Z]|^)osu/)) {
      send("We get it, you're a weeb.");
    }
    if (msg.toLowerCase() === "!whatthefuck" || msg.toLowerCase() === "!what") {
      send("https://docs.google.com/document/d/1u0-YAZG7Rv7P9N94vKEGocvJccGlDvK2RZxWMcg8pDA/edit?usp=sharing");
    }
    if (msg.toLowerCase().includes("trap")) {
      send("Traps? Ask Kairu about our Grade A Traps today!");
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
      let tem = whois(msg.substring("who is ".length));
      if (tem !== "") {
        send(tem);
      }
    }
    if (msg.toLowerCase().includes("what is gambl")) {
      send("gamble is bad");
    }
    if (msg.toLowerCase() === "!source2") {
      send("never");
    }
    if (msg.substring(0, "!joke".length).toLowerCase() === "!joke") {
      if (msg.split(" ").length > 1) {
        let x = parseInt(msg.substring("!joke ".length));
        if (x && x - 1 < jokes.length) {
          if (x == 69) {
            // send("")
          } else if (x === 0) {
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
    if (hascmd(msg, "priceof")) {
      getPrice(msg.substring("!priceof ".length), 730, send);
    }
    if (hascmd(msg, "po")) {
      getPrice(msg.substring("!po ".length), 730, send);
    }
    if (hascmd(msg, "podbg")) {
      getPrice(msg.substring("!podbg ".length), 730, send, null, true);
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
    if (hascmd(msg, "steam")) {
      try {
        steamgame.getGameSummary(msg.substring("!steam ".length), send);
      } catch (err) {
        console.log(err.message);
      }
    }
    if (message.channel.name == "game" && msg.substring(0, "g ".length).toLowerCase() === "g ") {
      let args = utils.clearEmptyArgs(msg.substring("g".length).split(" "));
      if (args[0] == "help") {
        send("See the full list of commands here: https://github.com/charredgrass/raocsgo-discord-bot/blob/master/docs/raocsgo/game.md");
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
      let args = argify(msg, "game");
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
    if (hascmd(msg, "gibs")) {
      let args = argify(msg, "gibs");
      if (args[0] === "listify" && args[1]) {
        message.channel.fetchMessages({
          limit: 100
        }).then((msgs) => {
          let marr = msgs.array();
          let people = [];
          for (let i = 0; i < marr.length; i++) {
            if (marr[i].content.includes(args[1])) {
              people.push(marr[i].author.username + "#" + marr[i].author.discriminator);
            }
          }
          let ret = [];
          for (let i = 0; i < people.length; i++) {
            if (ret.includes(people[i]) === false) {
              ret.push(people[i]);
            }
          }
          send("People who have said that phrase in the past 100 messages: " + ret.join(", "));
        });
      }
    }
    if (hascmd(msg, "help")) {
      let args = argify(msg, "help");
      if (args.length === 0) {
        send("Valid commands: !help, !what, !priceof, !imgof, who is [person], !magic8, !info\nType \"!help help\" for more specific help.");
        if (helpdocs[args[0]]) {
          send(helpdocs[args[0]]);
        }
      } else {
        send("Unknown command. Type \"!help\" for help.");
      }
    }
  }

  if (shouldResp.atg === true) {
    if (hascmd(msg, "tobees")) {
      let args = argify(msg, "tobees");
      if (args[0] == "myfuckingsanity") {
        send("That bad, huh?");
      }
      let val = Number(args[0]);
      if (isNaN(val) === false) {
        send("" + val + " USD is " + (20 * val) + " bees.");
      } else {
        send("Give me a number, dipshit.");
      }
    }
    if (hascmd(msg, "tousd")) {
      let args = argify(msg, "tousd");
      if (args[0] == "myfuckingsanity") {
        send("That bad, huh?");
      }
      let val = Number(args[0]);
      if (isNaN(val) === false) {
        send("" + val + " bees is " + (0.05 * val) + " USD.");
      } else {
        send("Give me a number, dipshit.");
      }
    }
    if (msg == "!token") {
      wow.getWowTokenPrice(TOKEN, send);
    }
    if (hascmd(msg, "prog")) {
      let args = argify(msg, "prog");
      let tr = wow.argsToNameAndRealm(args, HOMEREALM);
      if (tr[0] !== "" && tr[1] !== "") {
        wow.getCharacterProgressionData(WOWKEY, (chardata, err) => {
          if (err) {
            send(err);
          } else {
            const CURRENT_RAIDS = ["The Emerald Nightmare", "Trial of Valor", "The Nighthold", "Tomb of Sargeras", "Antorus, the Burning Throne"];
            const ABBREVS = [" EN", "ToV", " NH", "ToS", "ABT"];
            let progject = wow.getProgressionData(chardata, CURRENT_RAIDS, ABBREVS); //"progression object"
            send(wow.prettyProg(progject, CURRENT_RAIDS, ABBREVS, tr[1], tr[0]));
          }
        }, tr[1], tr[0]);
      }
    }
    if (msg == "!nextraid") {
      let nextraid = utils.getNextRaidTime();
      let tt = utils.timeTil(nextraid);
      send("The next raid time is: " + nextraid + ", which occurs in " + tt[0] + " hours " + tt[1] + " minutes " + tt[2] + " seconds.");
    }
    if (msg == "!amitoxic") {
      if (message.author.id === "203714293340962817") { //cory
        send("How'd you get unsilenced?");
      } else if (message.author.id === "170562747950563328") { //ryan
        send("You wasted your limited chat-restricted messages to ask that?");
      } else if (message.author.id === "170286101817327617" || message.author.id === "202642486504587264") { //lur/leo
        send("No, but you're gay.");
      } else if (message.author.id === "145024255787008000") { //stef
        send("yes, and retarded");
      } else if (message.author.id === "186256034086649857") { //justin
        send("yea");
      } else if (message.author.id === "247867522240610304") { //cham
        send("˙sǝ⅄");
      } else if (message.author.id === "274664443709751296" || message.author.id === "276220157532045323") { //mom/dad
        send("Does it run in the family? If so, probably.");
      } else {
        send("Idk probably");
      }
    }
    if (msg == "!attendance") {
      send("https://docs.google.com/spreadsheets/d/1S68QnG1zU_UBJ5kdUM237aGzBF5sStrZsoMLUxfMfk0/edit?usp=sharing");
    }
    if (hascmd(msg, "timer")) {
      let args = argify(msg, "timer");
      let flags = flagify(msg, "timer");
      if (args[0] == "start") {
        if (!timerobj || timerobj.howLong() < 0) { //if there is no timer, or the timer has expired
          if (flags["-t"] && Number(flags["-t"]) > 0) {
            timerobj = new timer(Number(flags["t"]) * 60 * 1000, send, ["Time's up."], Date.now()).startTimer();
            send("Started a " + Number(flags["t"]) + " minute timer."); //TODO make variable
          } else {
            timerobj = new timer(20 * 60 * 1000, send, ["Time's up."], Date.now()).startTimer();
            send("Started a " + 20 + " minute timer.");
          }
        } else {
          send("There is currently a timer running, clear it first using `!timer clear`.");
        }
      } else if (args[0] == "check") {
        if (timerobj) {
          let n = timerobj.howLong();
          if (n > 0) {
            send("" + utils.millisToMinutes(n) + " minutes remaining.");
          } else {
            send("The timer expired " + utils.millisToMinutes(n) + " minutes ago.");
          }
        } else {
          send("The timer is not currently running.");
        }
      } else if (args[0] == "clear") {
        if (timerobj) {
          let n = timerobj.howLong();
          if (n > 0) {
            send("Clearing a timer that had " + utils.millisToMinutes(n) + " of " + utils.millisToMinutes(timerobj.duration) + " minutes remaining.");
          } else {
            send("Clearing a timer that expired " + utils.millisToMinutes(n) + " minutes ago.");
          }
          timerobj.stop();
          timerobj = null;
        } else {
          send("There is not currently a timer running.");
        }
      }
    }
  }

  if (shouldResp.dnd == true) {
    if (hascmd(msg, "hp")) {
      let args = argify(msg, "hp");
      if (args[0] === "help") {
        send("!hp <hitdie> <level> <con>");
        return;
      }
      let hitdie = Number(args[0]);
      let level = Number(args[1]);
      let con = Number(args[2]);
      if (isNaN(hitdie) === false && isNaN(level) === false && isNaN(con) === false) {
        send(getHP(hitdie, level, con) + " HP"); //could have done getHP(...args) for syntactic sugar
      } else {
        send("!hp help");
      }
    }
  }

  if (message.author.id === "154826263628873728") {
    if (hascmd(msg, "setbotname")) {
      let args = argify(msg, "setbotname");
      if (args.length !== 0) {
        client.user.setUsername(args[0]);
      }
    }
  }
});


client.login(fs.readFileSync("./key.txt").toString("utf-8"));
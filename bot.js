//Importing node.js modules
const Discord = require("discord.js");
const SteamCommunity = require("steamcommunity");
const fs = require("fs");

//Instantiating module objects
const client = new Discord.Client();
const community = new SteamCommunity();

//Importing my own files
const utils = require("./lib/utils.js");
const timer = require("./lib/timer.js");    //TODO
const wow = require("./lib/wow.js");
const lbh = require("./lib/lb_archive.js"); //TODO
const dnd = require("./lib/dnd.js");
const book = require("./lib/booktext.js");
const math = require("./lib/math/main.js"); //TODO
const words = require("./lib/dictionary.js");
const mtg = require("./lib/mtg.js");
const scryfall = require("./lib/mtg/scryfall.js");
const basicCmds = require("./lib/basiccmds.js");

const game = require("./lib/game/game.js");
const gameChat = require("./lib/game/commands.js");

//TODO make a fancy config object that crashes on undefined values
let config = JSON.parse(fs.readFileSync("./config.json").toString("utf-8"));

const raocsgoCommands = require("./lib/raocommands.js");
const whos = JSON.parse(fs.readFileSync("./texts/whois.json").toString("utf-8"));
const whois = raocsgoCommands.whoIsCreator(whos);
//TODO load !help stuff in help file
const jokeList = fs.readFileSync("./texts/jokes.txt").toString("utf-8").split("\n");
const joke = raocsgoCommands.jokesCreator(jokeList);
const graveList = JSON.parse(fs.readFileSync("./texts/graves.json").toString("utf-8"));
const grave = raocsgoCommands.gravesCreator(graveList);
const priceOf = raocsgoCommands.priceOfCreator(community);
//Removed imgOf because of changes to how the SCM sorts its data.

const dictionary = words.loadWords(fs.readFileSync("./texts/dictionary.txt"));
const finallys = words.finallyCreator(dictionary);
const binallys = words.binallyCreator(finallys);

// const prog = wow.progCreator(config.wow.homeRealm, config.wow.api.key);
// const wowT = wow.tokenCreator(config.wow.api.token);
const wowAPI = new wow.WowAPI(config.wow.api.id, config.wow.api.secret, config.wow.homeRealm);

const gameData = JSON.parse(fs.readFileSync("./data/game_data.json").toString("utf-8"));
const g = new game(gameData, (data) => {
  fs.writeFileSync("./data/game_data.json", JSON.stringify(data));
});
setInterval(() => {
  g.save();
}, 1000 * 60 * 30); //save every 30 minutes


const gameCommands = gameChat.gameCommandCreator(g);

//TODO load leaderboard archive
const enchantmentDB = new book.Book("./texts/enchantments.json", ["int", "aug", "aff", "0", "1", "2", "3"]);
const ench = book.enchantmentCreator(enchantmentDB);

const pickStorage = {text:null};

const cmds = {
  /**@param {Array} args
   * @param {Function} send
   * **/
  "ping": (args, send) => {
    return send("pong");
  },
  "whois": whois,
  "joke": joke,
  "grave": grave,
  "priceof": priceOf,
  "finally": finallys,
  "🅱inally": binallys,
  "ench": ench,
  "game": gameCommands,
  "prog": wowAPI.getProgCreator(),
  "token": wowAPI.getWowTPriceCreator(),
  "mtg": mtg.mtgCardImage,
  "mtgsets": mtg.mtgSets,
  "hp": dnd.hpCommandAdvanced,
  "weigh": dnd.coinsToWeight,
  "brickpicks": basicCmds.printPlaylist,
  "brickpick": basicCmds.currPickCreator(pickStorage),
  "setpick": basicCmds.setPickCreator(pickStorage)
};

//Enable reading from stdin
process.stdin.setEncoding("utf8");
const consoleCommands = {
  "reload": () => {
    //TODO call reload functions on all modules
    return "Reloaded.";
  },
  "test": () => {

  },
  "stop": () => {
    //call game module to save it
    g.save();
    process.exit(0);
    return "Stopping";
  }
};
process.stdin.on("data", (text) => {
  text = text.replace(/[\n\r\t]/g, "").replace(/ {2+}/g, " ");
  let args = text.split(" ");
  let command = args[0].toLowerCase();
  let echoed;
  if (consoleCommands.hasOwnProperty(command) === true) {
    echoed = consoleCommands[command](...args);
    console.log(echoed);
  } else {
    console.log("Unknown command. Type `help` for help.");
  }
});

//Event listener to trigger when bot starts
client.on("ready", () => {
  console.log("Connected and initialized.");
});


function serverSelector(serverID) {
  let ret = {
    atg: false,
    frz: false,
    rao: false,
    dnd: false
  };
  if (serverID === "167586953061990400") { //RAOCSGO
    ret.rao = true;
  } else if (serverID === "276220128822165505") { //AtG
    ret.atg = true;
  } else if (serverID === "234382619767341056") { //r/Frozen
    ret.frz = true;
  } else if (serverID === "446813545049358336") { //D&D
    ret.dnd = true;
  }else if (serverID === "220039870410784768") { //Clowns
    ret.dnd = true;
  } else if (serverID === "313169519545679872" || !serverID) { //nass and dmchannel
    ret.atg = true;
    ret.frz = true;
    ret.rao = true;
    ret.dnd = true;
  }
  return ret;
}

//Main event listener for messages
client.on("message", (message) => {

  if (message.author.bot === true) return;

  let loc = message.channel;
  let msg = message.content;

  //send helper functions
  let send = function (text, opts) {
    loc.send(text, opts).catch((err) => {
      console.log(err);
    });
  };
  let sendImg = function (text, img) {
    if (img) {
      send(text, {
        embed: new Discord.RichEmbed().setImage(img)
      });
    } else {
      send(text);
    }
  };

  let server;
  if (loc.guild) {
    server = loc.guild.id;
  }


  for (let command in cmds) {
    if (cmds.hasOwnProperty(command)) {
      if (utils.hascmd(msg, command) || msg === "!" + command) {
        let args = utils.argify(msg, command);
        cmds[command](args, send, serverSelector(server), message.author, sendImg, message.mentions);
      }
    }
  }
  //Special Cases
  if (msg.substring(0, "who is ".length).toLowerCase() === "who is ") {
    let name = msg.substring("who is ".length);
    cmds["whois"](name.split(" "), send, serverSelector(server), message.author, sendImg, message.mentions);
  }
  if (message.channel.name === "botstuff" || message.channel.name === "game") {
    if (msg.substring(0, "g ".length).toLowerCase() === "g ") {
      let args = msg.substring("g ".length);
      cmds["game"](args.split(" "), send, serverSelector(server), message.author, sendImg, message.mentions);
    }
  }
  if (server === "276220128822165505" || server === "313169519545679872") {
    let matcher = /^[Ii]'?[Mm] (.*)/;
    let match = msg.match(matcher);
    if (match && match[1]) {
      message.member.setNickname(match[1]).then(()=>{
        send("Hi " + match[1]);
      })
    }
  }

});

client.login(config.discord.key);


















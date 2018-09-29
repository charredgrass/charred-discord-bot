//Importing node.js modules
const Discord = require("discord.js");
const SteamCommunity = require("steamcommunity");
const fs = require("fs");

//Instantiating module objects
const client = new Discord.Client();
const community = new SteamCommunity();

//Importing my own files
const gamemod = require("./lib/game_utils.js");
const steamgame = require("./lib/steamgame.js");
const utils = require("./lib/utils.js");
const timer = require("./lib/timer.js");
const slots = require("./lib/slots.js");
const wow = require("./lib/wowapi.js");
const lbh = require("./lib/lb_archive.js");
const dnd = require("./lib/dnd.js");
const book = require("./lib/booktext.js");
const math = require("./lib/math/main.js");
const words = require("./lib/words.js");

//assigning these just so I don't need to type them out
const hascmd = utils.hascmd;
const argify = utils.argify;
const flagify = utils.flagify;

let config = JSON.parse(fs.readFileSync("./config.json").toString("utf-8"));

const raocsgoCommands = require("./lib/raocommands.js");
const whos = JSON.parse(fs.readFileSync("./texts/whois.json").toString("utf-8"));
const whois = raocsgoCommands.whoIsCreator(whos);
//TODO load !help stuff in help file
const jokeList = fs.readFileSync("./texts/jokes.txt").toString("utf-8").split("\n");
const joke = raocsgoCommands.jokesCreator(jokeList);
const graveList = JSON.parse(fs.readFileSync("./texts/graves.json").toString("utf-8"));
const grave = raocsgoCommands.gravesCreator(graveList);
//TODO load dictionary
//TODO load game data in game file
//TODO load finallys in finallys module

//TODO load game module
//TODO load leaderboard archive
//TODO load enchantments

//TODO populate commands object with commands
const cmds = {
  /**{Array} args
   * {Function} send
   * **/
  "ping": (args, send) => {
    return send("pong");
  },
  "whois": whois,
  "joke": joke,
  "grave": grave
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
  } else if (serverID === "313169519545679872" || !serverID) { //nass and dmchannel
    ret.atg = true;
    ret.frz = true;
    ret.rao = true;
  }
  return ret;
}

//Main event listener for messages
client.on("message", (message) => {

  if (message.author.bot === true) return;

  let loc = message.channel;
  let msg = message.content;

  //send helper function
  let send = function (text, opts) {
    loc.send(text, opts).catch((err) => {
      console.log(err);
    });
  };

  let server;
  if (loc.guild) {
    server = loc.guild.id;
  }


  for (let command in cmds) {
    if (cmds.hasOwnProperty(command)) {
      if (utils.hascmd(msg, command) || msg === "!" + command) {
        let args = utils.argify(msg, command);
        cmds[command](args, send, serverSelector(server));
      }
    }
  }
  //Special Cases
  if (msg.substring(0, "who is ".length).toLowerCase() === "who is ") {
    let name = msg.substring("who is ".length);
    cmds["whois"](name.split(" "), send, serverSelector(server));
  }

});

client.login(config.discord.key);


















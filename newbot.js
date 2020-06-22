//Importing node.js modules
const Discord = require("discord.js");
const fs = require("fs");

const logger = require("./lib/logger.js");
const utils = require("./lib/utils.js");

const client = new Discord.Client();

let config = JSON.parse(fs.readFileSync("./config.json").toString("utf-8"));

//Enable reading from stdin
process.stdin.setEncoding("utf8");
const consoleCommands = {
  "reload": () => {
    //Call reload function on each module here.
    return "Reloaded.";
  },
  "test": () => {
    //Test code here.
    return "";
  },
  "stop": () => {
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

let modules = [{
  handle: (data) => {
    if (data.message == "!ping") {
      data.send("pong");
    }
  }
}];

//Main event listener for messages
client.on("message", (message) => {

  if (message.author.bot === true) return;

  let loc = message.channel;
  let msg = message.content;

  let server;
  if (loc.guild) {
    server = loc.guild.id;
  }

  let mdata = {
    send: function(text, opts) {
      loc.send(text, opts).catch((err) => {
        console.log(err);
      });
    },
    sendImg: function(text, img) {
      if (img) {
        send(text, {
          embed: new Discord.RichEmbed().setImage(img)
        });
      } else {
        send(text);
      }
    },
    message: msg,
    server: server
  }
  let a = utils.argsplit(msg); //will be null if msg is not a !command, otherwise will be an array
  //TODO add filtering to only grab messages that fit command-form, to reduce on processing time
  if (a) {
    for (let m of modules) {
      if (!(m.handle && typeof m.handle === 'function')) {
        logger.warn("A handler was configured incorrectly.");
      } else if (m.checker && typeof m.checker === 'function') {
        if (m.checker(a) === true) {
          m.handle(mdata);
        }
      } else {
        logger.warn("A checker was configured incorrectly.");
      }
    }
  }
});

client.login(config.discord.key);

//Event listener to trigger when bot starts
client.on("ready", () => {
  console.log("Connected and initialized.");
});
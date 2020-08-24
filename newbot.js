//Importing node.js modules
const Discord = require("discord.js");
const fs = require("fs");

const logger = require("./lib/logger.js");
const utils = require("./lib/utils.js");

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

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

let modules = [{
  handle: (data) => {
    data.send("pong");
  },
  check: (args, selector, channelName) => {
    if (args[0] == "!ping") {
      return true;
    }
  }
}, {
  handle: (data) => {

  }, 
  check: (args, selector, channelName) => {
    if (args[0] == "!stamrow") {
      return true;
    }
  }
}];

modules.push(require("./lib/rolemanager.js"));

//Main event listener for messages
client.on("message", (message) => {

  if (message.author.bot === true) return;

  let loc = message.channel;
  let msg = message.content;

  let server, channelName;
  if (loc.guild) {
    server = loc.guild.id;
    channelName = loc.name;
  }
  selector = serverSelector(server);
  let args = utils.argsplit(msg); //will be null if msg is not a !command, otherwise will be an array
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
    message: msg, //the message content
    server: server, //the server id
    selector: selector, //server selector object
    channel: channelName, //channel name as string
    args: args, //array of args
    location: loc, //Channel object
    author: message.author, //author object
    member: message.member, //GuildMember object
    delete: () => {
      message.delete();
    }, //delete function
    client: client
  }
  if (args) { //only if it is a valid !command
    for (let m of modules) {
      if (!(m.handle && typeof m.handle === 'function')) {
        logger.warn("A handler was configured incorrectly.");
      } else if (m.check && typeof m.check === 'function') {
        if (m.check(args, selector, channelName) === true) {
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
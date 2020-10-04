//Importing node.js modules
const Discord = require("discord.js");
const fs = require("fs");

const logger = require("./lib/logger.js");
const utils = require("./lib/utils.js");

const votemanager = require("./lib/votemanager.js");

const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

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
    dnd: false,
    dms: false
  };
  if (serverID === "167586953061990400") { //RAOCSGO
    ret.rao = true;
  } else if (serverID === "276220128822165505") { //AtG
    ret.atg = true;
  } else if (serverID === "234382619767341056") { //r/Frozen
    ret.frz = true;
  } else if (serverID === "446813545049358336") { //D&D
    ret.dnd = true;
  } else if (serverID === "220039870410784768") { //Clowns
    ret.dnd = true;
  } else if (serverID === "313169519545679872" || !serverID) { //nass and dmchannel
    ret.atg = true;
    ret.frz = true;
    ret.rao = true;
    ret.dnd = true;
  }
  if (!serverID) {
    ret.dms = true;
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
}];

const vm = new votemanager.VoteManager("votes.json", ["a", "b", "c"], ["❤️", "❄️"]);

modules.push(vm.getVoter());

//Main event listener for messages
client.on("message", (message) => {

  if (message.author.bot === true) return;

  let loc = message.channel;
  let msg = message.content; //this will be weird with mentions

  let server, channelName;
  if (loc.guild) { //If loc.guild is not null, it is a server (not DMChannel)
    server = loc.guild.id;
    channelName = loc.name;
  }
  selector = serverSelector(server); //set bits of selector based on which server this is
  //TODO make args configurable. check what server we are in and make it so we can change the prefix.
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
    delete: () => {
      message.delete();
    }, //delete function
    msg: msg, //the message content
    server: server, //the server id
    message: message, //Message object
    client: client, //the Discord client associated with the discord.js instance
    args: args,
    isAdmin: (config.admins.indexOf(message.author.id))
  }
  if (args) { //only if it is a valid !command
    for (let m of modules) {
      if (!(m.handle && typeof m.handle === 'function')) {
        logger.warn("A handler was configured incorrectly.");
        if (!m.handle) {
          logger.warn("The handler does not exist.");
        } else if (typeof m.handle !== 'function') {
          logger.warn("The handler is not a function.");
        }
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

client.login(config.discord.key).then(() => {
  console.log("Successfully logged in.")
}).catch((e) => {
  console.log("Error logging in:");
  console.log(e);
});

//Event listener to trigger when bot starts
client.on("ready", () => {
  console.log("Connected and initialized.");
});
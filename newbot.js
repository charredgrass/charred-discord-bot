//Importing node.js modules
const Discord = require("discord.js");
const fs = require("fs");

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

let modules = [];

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
  for (let m in modules) {
    if (m.handle && typeof m.handle == 'function') {
      m.handle(msg, send);
    }
  }
});

client.login(config.discord.key);

//Event listener to trigger when bot starts
client.on("ready", () => {
  console.log("Connected and initialized.");
});
//Importing node.js modules
const Discord = require("discord.js");
const fs = require("fs");

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
process.stdin.on("data", (text: string) => {
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
//Importing node.js modules
import * as Discord from 'discord.js';
import { REST } from '@discordjs/rest';
const fs = require("fs");

//import my stuff
import {
	SCommand, 
	MessageLocation, 
	ChannelLocation
} from "./types/types";
import * as Commands from './cmds/core';

const intents = [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.DirectMessages];
const client = new Discord.Client({intents});

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
  },
  "register": () => {
    registerCommands();
    return "Process completed."
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



function serverSelector(serverID : string) : object {
	//feel like i should probably rework this to be like
	// a bit array or something
  let ret = {
    atg: false,
    frz: false,
    rao: false,
    dnd: false,
    dms: false,
    tst: false,
    rs:  false,
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
    ret.rs = true;
  } else if (serverID === "313169519545679872" || !serverID) { //nass and dmchannel
    ret.atg = true;
    ret.frz = true;
    ret.rao = true;
    ret.dnd = true;
    ret.tst = true; //test servers
    ret.rs = true;
    ret.dms = true;
  }
  if (!serverID) {
    ret.dms = true;
  }
  return ret;
}

//return null if it isn't a command
function argsplit(message : string) : string[] {
	message = message.toString()
	let p = message.search(/^\s*!(\w).*/);
	if (p < 0) {
		return null;	
	}
	//now remove leading spaces and doublespaces
	message = message.replace(/^\s*/, "").replace(/\s+/g, " ");
	let args = message.split(" ");
	return args;
}

// let commands : Command[] = [];
// commands = Commands.cmds;

// client.on("messageCreate", (message: Discord.Message) => {
// 	if (message.author.bot === true) return;

// 	let loc : Discord.TextBasedChannel = message.channel; //change this later
// 	let msg = message.content;

// 	let server, channelName;
	
// 	if (loc.hasOwnProperty("guild")) { //If loc.guild is not null, it is a server (not DMChannel)
//     	let nloc = loc as ChannelLocation;
//     	server = nloc.guild.id;
//     	channelName = nloc.name;
//   	}

//   	let selector = serverSelector(server);
//   	let args = argsplit(msg);

//   	if (args) {
//   		for (let c of commands) {
//   			if (args[0] == "!" + c.name && c.select(selector)) {
//   				c.run(args, message);
//   			}
//   		}
//   	}

// });

let commands : SCommand[] = [];
commands = Commands.cmds;
let guildCommandList : Object = {};
const guilds = {
  NASS: "313169519545679872",
}
for (const key in guilds) {
  guildCommandList[guilds[key]] = [];
}

const clientid = config.discord.clientid;
const nassid = "313169519545679872";

const rest = new REST({ version: '10' }).setToken(config.discord.key);

function registerCommands() {
  for (const cmd of commands) {
    if (cmd.flavor === "runescape") { //TODO make this a function
      guildCommandList[guilds.NASS].push(cmd.data.toJSON());
    } else if (cmd.flavor === "test") {
      guildCommandList[guilds.NASS].push(cmd.data.toJSON());
    }
  }
  for (const g in guildCommandList) {
    let toReg = guildCommandList[g];
    (async () => {
      try {
        console.log(`Started refreshing ${toReg.length} application (/) commands in guild ${g}`);
        const data = await rest.put(
          Discord.Routes.applicationGuildCommands(clientid, g),
          {body: toReg}
        );

        console.log(`Successfully reloaded commands for guild ${g}.`);
      } catch (err) {
        console.error(err);
      }
    })();
  }
}


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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  // console.log(interaction);

  const cmdName : string = interaction.commandName;
  let cmd : SCommand;

  for (let c of commands) {
    if (c.name === cmdName) { //could cause issues if SlashCommandBuilder does not match this.name
      cmd = c;
    }
  }

  try {
    await cmd.execute(interaction);
  } catch (err){
    console.error(err);
    await interaction.reply({content: 'An error occured while executing command.', ephemeral: true});
  }

});
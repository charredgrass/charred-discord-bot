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

let commands : Discord.Collection<string, SCommand> = new Discord.Collection();
commands = Commands.cmds;
let guildCommandList : Object = {};
const guilds = {
  NASS: "313169519545679872",
  CLOWNS: "220039870410784768",
  RAOCSGO: "167586953061990400",
  ATG: "276220128822165505",
  RFROZEN: "234382619767341056"
}
for (const key in guilds) {
  guildCommandList[guilds[key]] = [];
}

const clientid = config.discord.clientid;
const nassid = "313169519545679872";

const rest = new REST({ version: '10' }).setToken(config.discord.key);

function registerCommands() {
  for (const c of commands) {
    const cmd = c[1]; //the value of the k-v pair
    if (cmd.flavor === "runescape") { //TODO make this a function
      guildCommandList[guilds.NASS].push(cmd.data.toJSON());
      guildCommandList[guilds.CLOWNS].push(cmd.data.toJSON());
    } else if (cmd.flavor === "genshin") {
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

async function handleAutocomplete(interaction : Discord.AutocompleteInteraction) {
  const cmdName : string = interaction.commandName;
  let cmd : SCommand = commands.get(cmdName);

  try { 
    await cmd.autocomplete(interaction);
  } catch (err) {
    console.error(err);
  }

}

client.on("interactionCreate", async (interaction) => {
  // console.log(interaction);
  if (interaction.isAutocomplete()) {
    handleAutocomplete(interaction);
    return;
  }
  if (!interaction.isChatInputCommand()) return;
  // console.log(interaction);

  const cmdName : string = interaction.commandName;
  let cmd : SCommand = commands.get(cmdName);

  try {
    await cmd.execute(interaction);
  } catch (err){
    console.error(err);
    await interaction.reply({content: 'An error occured while executing command.', ephemeral: true});
  }

});
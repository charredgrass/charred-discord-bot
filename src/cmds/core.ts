import {
	Command, 
	MessageLocation, 
	ChannelLocation,
	Logger,
	Selector,
	SCommand
} from "../types/types";

import * as rs from './runescape';
import * as rsc from './runescapecalc';
import * as tft from './tft';
import * as genshin from './genshincalc'

import {
	SlashCommandBuilder, 
	ChatInputCommandInteraction,
	Collection
 } from "discord.js";

let ping : SCommand = {
	name: "ping",
	flavor: "test",
	data: new SlashCommandBuilder().setName("ping").setDescription("test command"),
	async execute(interaction : ChatInputCommandInteraction) {
		interaction.reply("pong");
	}
}

// let oldcmds : Command[] = [/*ping, rs.getPrice, rsc.howDry, rsc.chanceBelow*/, tft.augprob];

let scmds : SCommand[] = [ping, rs.getPrice, genshin.chanceHit, rsc.howDry, rsc.chanceBelow];
let cmds : Collection<string, SCommand> = new Collection();
for (let sc of scmds) {
	cmds.set(sc.name, sc);
}

export { cmds };
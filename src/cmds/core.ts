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

import {
	SlashCommandBuilder, 
	ChatInputCommandInteraction
 } from "discord.js";

//Example Command
//name: name of the command. In this case executed using !ping.
//run: the logic of the command. Executed using ![name] [args]
//     args: a string[] with each of the args
//     message: the Message object that invoked the command.
//              Other properties (such as the channel it was in) can be
//              derived from this.
//select: logic that determines what servers to run this in. This is passed
//        in a selector object, where each property represents a server.
//        If the property is true, the message was in that server.
//        Return true for the command to execute, and false if not.
//        Example: return selector.dnd; to execute only in DND servers. 
// let ping : Command = {
// 	name: "ping",
// 	run: (args, message) => {
// 		message.channel.send("pong");
// 	},
// 	select: (selector : Selector) => {
// 		return true;
// 	}
// };

let ping : SCommand = {
	name: "ping",
	flavor: "test",
	data: new SlashCommandBuilder().setName("ping").setDescription("test command"),
	async execute(interaction : ChatInputCommandInteraction) {
		interaction.reply("pong");
	}
}


let oldcmds : Command[] = [/*ping, rs.getPrice,*/ rsc.howDry, rsc.chanceBelow, tft.augprob];

let cmds : SCommand[] = [ping, rs.getPrice];

export { cmds};
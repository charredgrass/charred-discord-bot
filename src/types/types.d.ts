import * as Discord from 'discord.js';

export interface Command {
	name: string;
	run: (args: string[], msg: Discord.Message) => any;
}

//A place where a message can appear.
export type MessageLocation = Discord.TextChannel
	| Discord.DMChannel
	| Discord.NewsChannel;

//A channel where a message can appear. Contains specific
//    properties such as channel name and the server it's in.
//  Subset of MessageLocation
export type ChannelLocation = Discord.TextChannel
	| Discord.NewsChannel;
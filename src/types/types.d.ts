import * as Discord from 'discord.js';

//An object that stores the logic for executing a command.
//Example commands available in /src/cmds/core.ts
export interface Command {
	name: string;
	run: (args: string[], msg: Discord.Message) => any;
	select: (selector: Object) => boolean;
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
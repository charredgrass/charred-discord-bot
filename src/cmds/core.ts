import {
	Command, 
	MessageLocation, 
	ChannelLocation
} from "../types/types";

let ping : Command = {
	name: "ping",
	run: (args, message) => {
		message.channel.send("pong");
	}
};

let cmds : Command[] = [ping];

export { cmds };
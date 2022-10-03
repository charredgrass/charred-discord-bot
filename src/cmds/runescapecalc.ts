import {
	Command,
	SCommand, 
	Selector
} from "../types/types";

import {
	binompdf
} from "../lib/statmath";

import {
	SlashCommandBuilder, 
	ChatInputCommandInteraction, 
	EmbedBuilder
} from "discord.js";

let howDry : SCommand = {
	name: "dry",
	flavor: "runescape",
	data: new SlashCommandBuilder().setName("dry").setDescription("Dry Calculator")
		.addIntegerOption(option => 
			option.setName("droprate")
				.setDescription("The droprate 1/x of the item (just input x)")
				.setRequired(true))
		.addIntegerOption(option => 
			option.setName("kc")
				.setDescription("Your killcount")
				.setRequired(true)),
	async execute(interaction : ChatInputCommandInteraction) {
		await interaction.deferReply();
		let odds : number = Number(interaction.options.get("droprate").value);
		let kc : number = Number(interaction.options.get("kc").value);
		let resp : number = (100*(1 - binompdf(kc, 1/odds, 0)));
		return interaction.editReply(
			`The chances of getting at least one 1/${odds} drop at ${kc} kc is ${resp}%.`);
	}
}

let chanceBelow : SCommand = {
	name: "chance",
	flavor: "runescape",
	data: new SlashCommandBuilder().setName("chance").setDescription("Drops Calculator")
		.addIntegerOption(option => 
			option.setName("droprate")
				.setDescription("The droprate 1/x of the item (just input x)")
				.setRequired(true))
		.addIntegerOption(option => 
			option.setName("kc")
				.setDescription("Your killcount")
				.setRequired(true))
		.addIntegerOption(option => 
			option.setName("drops")
				.setDescription("Drops received")
				.setRequired(true)),
	async execute(interaction : ChatInputCommandInteraction) {
		await interaction.deferReply();
		let odds : number = Number(interaction.options.get("droprate").value);
		let kc : number = Number(interaction.options.get("kc").value);
		let drops : number = Number(interaction.options.get("drops").value);
		let chance = 0;
		//chance = sum from i = 0 to drops-1 of binompdf(kc, 1/odds, i)
		for (let i = 0; i < drops; i++) {
			// console.log(chance);
			// console.log(binompdf(kc, 1/odds, i));
			chance += binompdf(kc, 1/odds, i);
		}
		return interaction.editReply(
			`The chances of getting at ${drops} or more drops at a rate of 1/${odds} with ${kc} kc is ${(100*(1 - chance))}%.`);
	}
}



export {howDry, chanceBelow};
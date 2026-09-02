import { SlashCommandBuilder } from "discord.js";

export const ask = new SlashCommandBuilder()
	.setName("ask")
	.setDescription("Talk to Amadeus")
	.addStringOption((option) =>
		option
			.setName("question")
			.setDescription("Your Question")
			.setRequired(true),
	)
	.toJSON();

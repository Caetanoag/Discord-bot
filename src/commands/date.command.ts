import { SlashCommandBuilder } from "discord.js";

export const date = new SlashCommandBuilder()
	.setName("date")
	.setDescription("Get Date")
	.toJSON();

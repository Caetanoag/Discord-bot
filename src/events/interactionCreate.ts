import type { Interaction } from "discord.js";
import { handleAsk } from "../controller/ai.controller.js";

export const handleInteractionCreate = async (interaction: Interaction) => {
	if (!interaction.isChatInputCommand()) return;

	switch (interaction.commandName) {
		case "ask":
			await handleAsk(interaction);
			break;
		case "date":
			await interaction.reply(new Date().toString());
			break;
		default:
			console.warn(`Unknown Command: ${interaction.commandName}`);
	}
};

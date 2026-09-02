import type * as discord from "discord.js";
import { askGroq, summarizeContext } from "../services/groq.service.js";
import { addInteraction, getContext } from "../services/memory.service.js";
import { checkRateLimit } from "../services/ratelimiting.service.js";
export const handleAsk = async (
	interaction: discord.ChatInputCommandInteraction,
): Promise<void> => {
	const question = interaction.options.getString("question", true);
	const userId = interaction.user.id;

	const limit = checkRateLimit(userId);

	if (limit.limited) {
		if (limit.reason === "user") {
			await interaction.reply({
				content: `Please wait ${limit.timeLeft}s before sending another message.`,
				ephemeral: true,
			});
			return;
		}

		if (limit.reason === "global") {
			await interaction.reply({
				content:
					"System capacity reached for this minute. Please wait a moment and try again.",
				ephemeral: true,
			});
			return;
		}
	}

	await interaction.deferReply();

	try {
		const context = getContext(userId);
		context.push({ role: "user", content: question });
		const result = await askGroq(context);
		await addInteraction(userId, question, result.response, summarizeContext);
		await interaction.editReply(`**${result.title}**\n${result.response}`);
	} catch (err) {
		console.error("[AIController] Error handling /ask:", err);
		await interaction.editReply("Could not answer that");
	}
};

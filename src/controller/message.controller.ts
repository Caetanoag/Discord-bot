import type * as discord from "discord.js";
import { askGroq, summarizeContext } from "../services/groq.service.js";
import { addInteraction, getContext } from "../services/memory.service.js";
import { checkRateLimit } from "../services/ratelimiting.service.js";
export const handleMention = async (
	message: discord.Message,
): Promise<void> => {
	if (message.author.bot || !message.client.user) return;
	if (!message.mentions.has(message.client.user.id)) return;

	const userId = message.author.id;

	const limit = checkRateLimit(userId);

	if (limit.limited) {
		if (limit.reason === "user") {
			await message.reply({
				content: `Please wait ${limit.timeLeft}s before sending another message.`,
			});
			return;
		}

		if (limit.reason === "global") {
			await message.reply({
				content:
					"System capacity reached for this minute. Please wait a moment and try again.",
			});
			return;
		}
	}
	const question = message.content.replace(/<@!?\d+>/g, "").trim();
	if (!question) {
		await message.reply("Do you need something?");
		return;
	}

	try {
		const context = getContext(userId);
		context.push({ role: "user", content: question });

		const result = await askGroq(context);

		await addInteraction(userId, question, result.response, summarizeContext);

		await message.reply(result.response);
	} catch (err) {
		console.error("[MessageController] Error handling mention:", err);
		await message.reply("Could not process that request.");
	}
};

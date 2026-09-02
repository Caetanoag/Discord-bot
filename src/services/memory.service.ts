import type { ChatMessage, UserMemory } from "../models/memory.models.js";

const userMemories = new Map<string, UserMemory>();

const getOrCreateMemory = (userId: string): UserMemory => {
	if (!userMemories.has(userId)) {
		userMemories.set(userId, { summary: null, history: [] });
	}
	return userMemories.get(userId) as UserMemory;
};

export const getContext = (userId: string): ChatMessage[] => {
	const memory = getOrCreateMemory(userId);
	const context: ChatMessage[] = [];

	if (memory.summary) {
		context.push({
			role: "system",
			content: `Summary of previous conversation context: ${memory.summary}`,
		});
	}

	context.push(...memory.history);
	return context;
};

export const addInteraction = async (
	userId: string,
	userMsg: string,
	botResponse: string,
	summarizeFn: (text: string) => Promise<string>,
): Promise<void> => {
	const memory = getOrCreateMemory(userId);

	memory.history.push({ role: "user", content: userMsg });
	memory.history.push({ role: "assistant", content: botResponse });

	if (memory.history.length >= 11) {
		console.log(`[MemoryService] Summarizing context for user: ${userId}`);

		const toSummarize = memory.history.slice(0, memory.history.length - 4);
		const keepRecent = memory.history.slice(memory.history.length - 4);

		const textBlock = toSummarize
			.map((m) => `${m.role === "user" ? "User" : "Amadeus"}: ${m.content}`)
			.join("\n");

		const textToSummarize = memory.summary
			? `Previous summary: ${memory.summary}\nNew messages:\n${textBlock}`
			: textBlock;

		try {
			memory.summary = await summarizeFn(textToSummarize);
			memory.history = keepRecent;
			console.log(
				`[MemoryService] Context successfully updated for user: ${userId}`,
			);
		} catch (error) {
			console.error(
				`[MemoryService] Failed to summarize context for user ${userId}:`,
				error,
			);
		}
	}
};

export const clearMemory = (userId: string): void => {
	userMemories.delete(userId);
	console.log(`[MemoryService] Memory cleared for user: ${userId}`);
};

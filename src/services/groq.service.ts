import type { GroqResponse } from "../models/groq.models.js";
import type { ChatMessage } from "../models/memory.models.js";
import { SYSTEM_PROMPT } from "../specs/system.prompt.js";
export const askGroq = async (
	contextMessages: ChatMessage[],
): Promise<GroqResponse> => {
	try {
		const groqApiResponse = await fetch(
			"https://api.groq.com/openai/v1/chat/completions",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: process.env.GROQ_MODEL,
					messages: [SYSTEM_PROMPT, ...contextMessages],
					temperature: 0.7,
					max_completion_tokens: 2048,
					top_p: 1,
					stream: false,
				}),
			},
		);

		if (!groqApiResponse.ok) {
			throw new Error(
				`API ERROR: ${groqApiResponse.status} - ${groqApiResponse.statusText}`,
			);
		}

		const data = await groqApiResponse.json();
		const responseInText = data.choices?.[0]?.message?.content;

		if (!responseInText) {
			return {
				title: "No Response",
				response: "Could not answer this question.",
			};
		}

		return {
			title: "Amadeus",
			response: responseInText,
		};
	} catch (err) {
		console.error("[GroqService] Error in askGroq:", err);
		throw new Error(`Unexpected Error happened: ${err}`);
	}
};
export const summarizeContext = async (
	textToSummarize: string,
): Promise<string> => {
	try {
		const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: process.env.GROQ_MODEL,
				messages: [
					{
						role: "system",
						content:
							"Summarize the following conversation context in a few concise sentences. Preserve key entities, facts, and user details.",
					},
					{ role: "user", content: textToSummarize },
				],
				temperature: 0.3,
				max_completion_tokens: 300,
			}),
		});

		if (!res.ok) return "";

		const data = await res.json();
		return data.choices?.[0]?.message?.content || "";
	} catch (error) {
		console.error("[GroqService] Error in summarizeContext:", error);
		return "";
	}
};

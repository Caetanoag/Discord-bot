export interface ChatMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

export interface UserMemory {
	summary: string | null;
	history: ChatMessage[];
}

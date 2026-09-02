import type { Client } from "discord.js";

export const handleReady = (client: Client<true>) => {
	console.log(`Amadeus is running as ${client.user.tag}`);
};

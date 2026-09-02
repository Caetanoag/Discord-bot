import { Client, GatewayIntentBits, type Message } from "discord.js";
import dotenv from "dotenv";
import { handleMention } from "./controller/message.controller.js";
import { handleInteractionCreate } from "./events/interactionCreate.js";
import { handleReady } from "./events/ready.js";

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.once("ready", handleReady);
client.on("interactionCreate", handleInteractionCreate);
client.on("messageCreate", async (message: Message) => {
	await handleMention(message);
});
client.login(process.env.DISCORD_TOKEN);

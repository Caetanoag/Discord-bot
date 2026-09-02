import { REST, Routes, SlashCommandBuilder } from "discord.js";
import "dotenv/config";

const commands = [
	new SlashCommandBuilder()
		.setName("ask")
		.setDescription("Talk to Amadeus")
		.addStringOption((option) =>
			option
				.setName("question")
				.setDescription("Your Question")
				.setRequired(true),
		)
		.toJSON(),
];

const rest = new REST({ version: "10" }).setToken(
	process.env.DISCORD_TOKEN as string,
);

async function main() {
	try {
		await rest.put(
			Routes.applicationGuildCommands(
				process.env.APPLICATION_ID as string,
				process.env.TEST_GUILD_ID as string,
			),
			{ body: commands },
		);
		console.log("New command: /ask");
	} catch (error) {
		console.error("Failure to register /ask:", error);
	}
}

main();

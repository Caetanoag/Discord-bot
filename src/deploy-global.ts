import { REST, Routes } from "discord.js";
import { commands } from "./commands/index.commands.js";
import "dotenv/config";

const rest = new REST({ version: "10" }).setToken(
	process.env.DISCORD_TOKEN as string,
);

async function main() {
	try {
		await rest.put(
			Routes.applicationCommands(process.env.APPLICATION_ID as string),
			{ body: commands },
		);

		const commandNames = commands.map((c) => c.name).join(", ");
		console.log(`[GLOBAL] Success at commands register: ${commandNames}`);
	} catch (error) {
		console.error("[GLOBAL] Failure at commands register: ", error);
	}
}

main();

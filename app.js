const { Client, Collection, GatewayIntentBits, REST, Routes } = require("discord.js");
const path = require("path");

const config = require("./config.json");
const { collectJavaScriptFiles } = require("./src/utils/collectFiles");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

async function deployCommands() {
  const commands = [];
  const commandsPath = path.join(__dirname, "src", "commands");
  const commandFiles = collectJavaScriptFiles(commandsPath);

  for (const filePath of commandFiles) {
    const command = require(filePath);

    if (command.data) {
      commands.push(command.data.toJSON());
    }
  }

  const rest = new REST({ version: "10" }).setToken(config.token);

  await rest.put(Routes.applicationCommands(config.clientId), {
    body: commands
  });
}

require("./src/handlers/commandHandler")(client);
require("./src/handlers/eventHandler")(client);

(async () => {
  try {
    if (process.argv.includes("--deploy")) {
      await deployCommands();
      console.log("Successfully deployed global slash commands.");
      console.log("Deploy-only mode complete.");
      return;
    }

    await client.login(config.token);
  } catch (error) {
    console.error("Failed to start the bot:", error);
    process.exitCode = 1;
  }
})();

const { Client, Collection, GatewayIntentBits, REST, Routes } = require("discord.js");
const path = require("path");

const config = require("./config.json");
const { collectJavaScriptFiles } = require("./src/utils/collectFiles");
const { acquireProcessLock, releaseProcessLock } = require("./src/utils/processLock");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

client.on("error", (error) => {
  console.error("[Client] Error event:", error);
});

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

  console.log(`[Deploy] Synced: ${commands.length} global slash commands`);
}

require("./src/handlers/commandHandler")(client);
require("./src/handlers/eventHandler")(client);

(async () => {
  let lockPath = null;

  try {
    if (process.argv.includes("--deploy")) {
      await deployCommands();
      console.log("[Deploy] Complete: deploy-only mode");
      return;
    }

    lockPath = acquireProcessLock(__dirname);

    const releaseLock = () => releaseProcessLock(lockPath);

    process.once("exit", releaseLock);
    process.once("SIGINT", () => {
      releaseLock();
      process.exit(0);
    });
    process.once("SIGTERM", () => {
      releaseLock();
      process.exit(0);
    });
    process.once("SIGBREAK", () => {
      releaseLock();
      process.exit(0);
    });

    await client.login(config.token);
  } catch (error) {
    releaseProcessLock(lockPath);
    console.error(`[Startup] Failed: ${error.message}`);
    console.error(error);
    process.exitCode = 1;
  }
})();

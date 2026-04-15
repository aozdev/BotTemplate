const path = require("path");

const { collectJavaScriptFiles } = require("../utils/collectFiles");

module.exports = (client) => {
  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = collectJavaScriptFiles(commandsPath);

  for (const filePath of commandFiles) {
    const command = require(filePath);
    const fallbackCategory = path.basename(path.dirname(filePath));
    const category = command.category || fallbackCategory;
    const fileName = path.basename(filePath);

    if (!command.data || !command.data.name) {
      console.log(`[Command] Failed: ${fileName}`);
      continue;
    }

    command.category = category.charAt(0).toUpperCase() + category.slice(1);
    client.commands.set(command.data.name, command);
    console.log(`[Command] Loaded: ${fileName}`);
  }
};

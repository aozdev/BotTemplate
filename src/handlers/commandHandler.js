const path = require("path");

const { collectJavaScriptFiles } = require("../utils/collectFiles");

module.exports = (client) => {
  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = collectJavaScriptFiles(commandsPath);

  for (const filePath of commandFiles) {
    const command = require(filePath);
    const fallbackCategory = path.basename(path.dirname(filePath));
    const category = command.category || fallbackCategory;

    if (!command.data || !command.data.name) {
      console.log(`Failed to load command: ${path.basename(filePath)}`);
      continue;
    }

    command.category = category.charAt(0).toUpperCase() + category.slice(1);
    client.commands.set(command.data.name, command);
    console.log(`Loaded command: ${command.data.name} [${command.category}]`);
  }
};

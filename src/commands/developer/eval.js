const { SlashCommandBuilder } = require("discord.js");
const { inspect } = require("util");

const config = require("../../../config.json");

module.exports = {
  category: "Developer",
  developerOnly: true,
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluates JavaScript code")
    .addStringOption(option =>
      option
        .setName("code")
        .setDescription("The code to evaluate")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.user.id !== config.developerId) {
      await interaction.reply({
        content: "You are not allowed to use this command.",
        ephemeral: true
      });
      return;
    }

    const code = interaction.options.getString("code", true);

    try {
      let result = eval(code);

      if (result instanceof Promise) {
        result = await result;
      }

      if (typeof result !== "string") {
        result = inspect(result, { depth: 1 });
      }

      if (result.length > 1900) {
        result = `${result.slice(0, 1900)}...`;
      }

      await interaction.reply({
        content: `\`\`\`js\n${result}\n\`\`\``,
        ephemeral: true
      });
    } catch (error) {
      await interaction.reply({
        content: `\`\`\`js\n${error}\n\`\`\``,
        ephemeral: true
      });
    }
  }
};

const { MessageFlags, SlashCommandBuilder } = require("discord.js");
const { inspect } = require("util");

const config = require("../../../config.json");
const { respondToInteraction } = require("../../utils/interactionResponses");

module.exports = {
  category: "Developer",
  developerOnly: true,
  defer: "ephemeral",
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
      await respondToInteraction(interaction, {
        content: "You are not allowed to use this command.",
        flags: MessageFlags.Ephemeral
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

      await respondToInteraction(interaction, {
        content: `\`\`\`js\n${result}\n\`\`\``,
        flags: MessageFlags.Ephemeral
      });
    } catch (error) {
      await respondToInteraction(interaction, {
        content: `\`\`\`js\n${error}\n\`\`\``,
        flags: MessageFlags.Ephemeral
      });
    }
  }
};

const { respondToInteraction } = require("../../utils/interactionResponses");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "General",
  defer: true,
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows the available slash commands"),

  async execute(interaction) {
    const groupedCommands = new Map();
    const commands = [...interaction.client.commands.values()].sort((left, right) =>
      left.data.name.localeCompare(right.data.name)
    );

    for (const command of commands) {
      const category = command.category || "Other";

      if (!groupedCommands.has(category)) {
        groupedCommands.set(category, []);
      }

      const label = command.developerOnly
        ? `\`/${command.data.name}\` - ${command.data.description} (Developer only)`
        : `\`/${command.data.name}\` - ${command.data.description}`;

      groupedCommands.get(category).push(label);
    }

    const embed = new EmbedBuilder()
      .setTitle("Bot Commands")
      .setColor("#5865F2")
      .setDescription("This bot uses slash commands only.")
      .addFields(
        [...groupedCommands.entries()].map(([category, entries]) => ({
          name: category,
          value: entries.join("\n")
        }))
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}` });

    await respondToInteraction(interaction, { embeds: [embed] });
  }
};

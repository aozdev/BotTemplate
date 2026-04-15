const { respondToInteraction } = require("../../utils/interactionResponses");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "General",
  defer: true,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot and API latency"),

  async execute(interaction) {
    const reply = await respondToInteraction(interaction, {
      content: "Pinging..."
    });

    const botLatency = reply.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    await interaction.editReply(
      [
        "Pong!",
        `Bot Latency: **${botLatency}ms**`,
        `API Latency: **${apiLatency}ms**`
      ].join("\n")
    );
  }
};

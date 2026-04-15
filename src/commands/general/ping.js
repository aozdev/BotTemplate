const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "General",
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot and API latency"),

  async execute(interaction) {
    const reply = await interaction.reply({
      content: "Pinging...",
      fetchReply: true
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

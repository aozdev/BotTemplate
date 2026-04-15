const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder
} = require("discord.js");

module.exports = {
  category: "General",
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Shows the avatar of a user")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The user whose avatar you want to view")
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user") || interaction.user;
    const avatarUrl = targetUser.displayAvatarURL({ size: 4096 });

    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.username}'s Avatar`)
      .setColor("#5865F2")
      .setImage(avatarUrl)
      .setFooter({ text: `Requested by ${interaction.user.tag}` });

    const components = [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Open Avatar")
          .setStyle(ButtonStyle.Link)
          .setURL(avatarUrl)
      )
    ];

    await interaction.reply({
      embeds: [embed],
      components
    });
  }
};

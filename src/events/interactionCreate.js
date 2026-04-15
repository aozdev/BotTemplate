module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Command failed: ${interaction.commandName}`, error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command.",
          ephemeral: true
        });
        return;
      }

      await interaction.reply({
        content: "There was an error while executing this command.",
        ephemeral: true
      });
    }
  }
};

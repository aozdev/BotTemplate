const { Events, MessageFlags } = require("discord.js");

const {
  deferCommandInteraction,
  isAlreadyAcknowledgedError,
  isUnknownInteractionError,
  respondToInteraction
} = require("../utils/interactionResponses");

module.exports = {
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      return;
    }

    try {
      await deferCommandInteraction(interaction, command.defer);
      await command.execute(interaction);
    } catch (error) {
      if (isUnknownInteractionError(error) || isAlreadyAcknowledgedError(error)) {
        console.warn(
          `[Interaction] ${interaction.commandName} was already acknowledged or expired before this process could respond.`
        );
        return;
      }

      console.error(`Command failed: ${interaction.commandName}`, error);

      try {
        await respondToInteraction(interaction, {
          content: "There was an error while executing this command.",
          flags: MessageFlags.Ephemeral
        });
      } catch (responseError) {
        if (isUnknownInteractionError(responseError)) {
          console.warn(
            `[Interaction] Response expired before ${interaction.commandName} could be answered.`
          );
          return;
        }

        if (isAlreadyAcknowledgedError(responseError)) {
          console.warn(
            `[Interaction] Error response for ${interaction.commandName} was skipped because another process already acknowledged it.`
          );
          return;
        }

        console.error(
          `[Interaction] Failed to send error response for ${interaction.commandName}`,
          responseError
        );
      }
    }
  }
};

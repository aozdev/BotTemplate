const { MessageFlags } = require("discord.js");

async function deferCommandInteraction(interaction, mode = true) {
  if (interaction.deferred || interaction.replied || !mode) {
    return null;
  }

  if (mode === "ephemeral") {
    return interaction.deferReply({ flags: MessageFlags.Ephemeral });
  }

  return interaction.deferReply();
}

async function respondToInteraction(interaction, options) {
  if (interaction.deferred) {
    const { flags, ...editOptions } = options;
    return interaction.editReply(editOptions);
  }

  if (interaction.replied) {
    return interaction.followUp(options);
  }

  return interaction.reply(options);
}

function isUnknownInteractionError(error) {
  return error?.code === 10062;
}

function isAlreadyAcknowledgedError(error) {
  return error?.code === 40060;
}

module.exports = {
  deferCommandInteraction,
  respondToInteraction,
  isAlreadyAcknowledgedError,
  isUnknownInteractionError
};

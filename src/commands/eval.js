const { SlashCommandBuilder } = require('discord.js');
const { inspect } = require('util');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Developer only eval command')
    .addStringOption(option =>
      option
        .setName('code')
        .setDescription('The code to evaluate')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Developer check
    if (interaction.user.id !== config.developerId) {
      return interaction.reply({
        content: '❌ You are not allowed to use this command.',
        ephemeral: true
      });
    }

    const code = interaction.options.getString('code');

    try {
      let result = eval(code);

      if (result instanceof Promise) {
        result = await result;
      }

      if (typeof result !== 'string') {
        result = inspect(result, { depth: 1 });
      }

      if (result.length > 1900) {
        result = result.slice(0, 1900) + '...';
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

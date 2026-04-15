const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  version: discordJsVersion
} = require("discord.js");
const os = require("os");

const config = require("../../../config.json");
const packageJson = require("../../../package.json");

function formatDuration(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return [days && `${days}d`, hours && `${hours}h`, minutes && `${minutes}m`, `${seconds}s`]
    .filter(Boolean)
    .join(" ");
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

function getAverageCpuUsage() {
  const cpuUsage = process.cpuUsage();
  const totalCpuMicros = cpuUsage.user + cpuUsage.system;
  const uptimeSeconds = process.uptime();
  const cpuCores = Math.max(os.cpus().length, 1);

  if (uptimeSeconds <= 0) {
    return 0;
  }

  return (totalCpuMicros / 1000 / (uptimeSeconds * 1000 * cpuCores)) * 100;
}

function getDeveloperLabel() {
  if (/^\d{17,20}$/.test(config.developerId)) {
    return `<@${config.developerId}>`;
  }

  return config.developerId || packageJson.author || "Not set";
}

function getRepositoryUrl() {
  const repository = packageJson.repository?.url || packageJson.homepage;

  if (!repository) {
    return null;
  }

  return repository
    .replace(/^git\+/, "")
    .replace(/\.git$/, "");
}

module.exports = {
  category: "General",
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Shows bot runtime details and resource usage"),

  async execute(interaction) {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = getAverageCpuUsage();
    const uptime = formatDuration(process.uptime());
    const repositoryUrl = getRepositoryUrl();

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.client.user.username} Stats`)
      .setColor("#5865F2")
      .addFields(
        { name: "Developer", value: getDeveloperLabel(), inline: true },
        { name: "Uptime", value: uptime, inline: true },
        { name: "Latency", value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
        { name: "CPU Usage", value: `${cpuUsage.toFixed(2)}%`, inline: true },
        { name: "RAM Usage", value: formatBytes(memoryUsage.rss), inline: true },
        { name: "Servers", value: `${interaction.client.guilds.cache.size}`, inline: true },
        { name: "Node.js", value: process.version, inline: true },
        { name: "Discord.js", value: `v${discordJsVersion}`, inline: true },
        { name: "Platform", value: `${os.type()} ${os.release()}`, inline: true }
      )
      .setTimestamp();

    const components = [];

    if (repositoryUrl) {
      components.push(
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("GitHub")
            .setStyle(ButtonStyle.Link)
            .setURL(repositoryUrl)
        )
      );
    }

    await interaction.reply({
      embeds: [embed],
      components
    });
  }
};

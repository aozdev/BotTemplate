const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Bot ready: ${client.user.tag}`);

    client.user.setPresence({
      activities: [
        {
          name: "/help for commands",
          type: ActivityType.Playing
        }
      ],
      status: "online"
    });
  }
};

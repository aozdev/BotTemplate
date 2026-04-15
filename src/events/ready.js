const { ActivityType, Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`[Client] Ready: ${client.user.tag}`);

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

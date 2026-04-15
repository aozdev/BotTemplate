const path = require("path");

const { collectJavaScriptFiles } = require("../utils/collectFiles");

module.exports = (client) => {
  const eventsPath = path.join(__dirname, "..", "events");
  const eventFiles = collectJavaScriptFiles(eventsPath);

  for (const filePath of eventFiles) {
    const event = require(filePath);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
  }

  console.log("Loaded client events.");
};

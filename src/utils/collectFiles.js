const fs = require("fs");
const path = require("path");

function collectJavaScriptFiles(directoryPath) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectJavaScriptFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(fullPath);
    }
  }

  return files;
}

module.exports = {
  collectJavaScriptFiles
};

# BotTemplate

BotTemplate is a fully slash-command Discord.js v14 starter bot for clean Discord bot development.
It keeps the codebase simple, uses category-based command folders, stores configuration in a single `config.json` file, and keeps startup logs intentionally plain.

## Highlights

- Slash commands only
- Discord.js v14 architecture
- Single root `app.js` entry file
- Command loading and command deployment handled directly inside `app.js`
- Category-based command folders such as `src/commands/bot` and `src/commands/developer`
- Plain startup logs for loaded events, loaded commands, and deployed commands
- Developer-only `/eval` command
- `/stats` command with runtime, RAM, latency, version details, and GitHub button
- `config.json` based setup without a separate `config.js`
- Simple Windows starter file through `start.bat`

## Commands

### Bot

- `/help`
  Shows the help menu and command groups.

- `/ping`
  Shows gateway latency and round-trip time.

- `/stats`
  Shows runtime details, RAM, latency, version information, and a GitHub link button.

### Developer

- `/eval`
  Runs JavaScript code for the configured developer only.

## Visual Walkthrough

### 1. Help Menu

![Help Menu](assets/screenshots/01-help-menu.svg)

This view shows the grouped slash command help menu. It highlights the folder-based command categories and the clean button row for GitHub, invite, and support links.

### 2. Stats Command

![Stats Command](assets/screenshots/02-stats-command.svg)

This view shows the stats output with latency, uptime, RAM usage, runtime versions, platform details, and the GitHub button.

### 3. Startup Console

![Startup Console](assets/screenshots/03-startup-console.svg)

This view shows the plain terminal logging style used during startup. Events, commands, and deployment messages are intentionally easy to scan.

## Configuration

Edit `config.json` before starting the bot.

```json
{
  "token": "YOUR_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "developerId": "YOUR_DEVELOPER_ID",
  "guildId": "YOUR_GUILD_ID",
  "commandDeployment": "guild",
  "embedColor": "#5865F2",
  "presence": "with slash commands",
  "supportServer": "https://discord.gg/your-server",
  "inviteUrl": "https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot%20applications.commands&permissions=8",
  "githubUrl": "https://github.com/aozdev/BotTemplate"
}
```

Notes:

- `commandDeployment` supports `guild` and `global`.
- `guildId` is required when `commandDeployment` is set to `guild`.
- `embedColor` is the default embed color used across the bot.
- `developerId` is the only account allowed to use `/eval`.

## Installation

1. Install dependencies:

```bash
npm install
```

2. Fill `config.json` with your real values.

3. Start the bot:

```bash
npm start
```

Optional deployment only:

```bash
npm run deploy
```

Optional local starter:

```bat
start.bat
```

Optional validation:

```bash
npm run check
```

## Logging

Startup logs are intentionally plain.
Examples:

- `[EVENT LOADED] interactionCreate.js event succesfully loaded`
- `[COMMAND LOADED] eval.js command succesfully loaded`
- `[COMMAND DEPLOYED] help.js command succesfully deployed`

## Slash Command Registration

Application commands are deployed at startup through the REST API.
If `commandDeployment` is set to `guild`, command refresh is usually immediate.
If `commandDeployment` is set to `global`, Discord may take a short time to refresh commands after a restart.

## Project Structure

```text
app.js
config.json
start.bat
assets/
  screenshots/
scripts/
  check.js
src/
  commands/
    bot/
    developer/
  events/
  utils/
```

## License

This project is released under the MIT License.

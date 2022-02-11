const { Client, Collection } = require("discord.js");
const { cleanup } = require('./cleanup');

const client = new Client({
    intents: 8,
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");

// Graceful Shutdown
process.on("SIGINT", () => { cleanup(client) });
process.on("SIGTERM", () => { cleanup(client) });

// Initializing the project
require("./handler")(client);

client.login(client.config.token);

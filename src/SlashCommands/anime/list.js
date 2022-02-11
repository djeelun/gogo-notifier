const { Client, CommandInteraction } = require("discord.js");
const { collection } = require("../../config.json");

module.exports = {
    name: "list",
    description: "Lists all anime being tracked",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        try {
            const animes = await client.mongo_db.collection(collection).find({}).toArray();

            // console.log(animes);

            interaction.followUp({ content: `**This channel is currently following**:\n` });
            // Send message using interaction.channelId
            const channel = await client.channels.fetch(interaction.channelId);
            if (!channel) {
                return;
            }

            const acc = [];
            let totalLength = 0;

            for (const anime of animes) {
                // console.log(anime);
                if (anime.channels.find(c => c == interaction.channelId)) {
                    acc.push(anime.name);
                    totalLength += anime.name.length;

                    if (totalLength > 1000) {
                        await channel.send(acc.join("\n"));
                        acc = [];
                        totalLength = 0;
                    }
                }
            }

            if (acc.length > 0) {
                await channel.send(acc.join("\n"));
            }
        } catch (error) {
            interaction.followUp({ content: `${error}` });
        }
    },
};

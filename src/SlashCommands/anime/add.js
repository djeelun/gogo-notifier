const { Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "add",
    description: "Adds an anime to track",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'anime_name',
            description: 'Name of the anime to track',
            type: "STRING",
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        try {
            const anime_name = interaction.options.get("anime_name").value;
            if (anime_name.length < 1 || anime_name.length > 100) {
                throw new Error("Anime name must be between 1 and 100 characters long.");
            }


            // Check if anime already exists (ignore case)
            const anime = await client.mongo_db.collection("anime-following").findOne({ name: { $regex: new RegExp(anime_name, "i") } });
            if (anime) {
                // Check if this channel is in channels property
                if (anime.channels.find(c => c == interaction.channelId)) {
                    throw new Error(`Anime "${anime_name}" is already being tracked in this channel.`);
                }
                else {
                    anime.channels.push(interaction.channelId);
                    await client.mongo_db.collection("anime-following").updateOne({ name: anime.name }, { $set: { channels: anime.channels } });
                    interaction.followUp({ content: `Now notifying for ${anime_name} in <#${interaction.channelId}>.` });
                }
            }
            // Create entry if it doesn't exist
            else {
                await client.mongo_db.collection("anime-following").insertOne({
                    name: anime_name,
                    channels: [interaction.channelId],
                    lastEp: ""
                });

                interaction.followUp({ content: `Now notifying for ${anime_name} in <#${interaction.channelId}>.` });
            }

        } catch (error) {
            interaction.followUp({ content: `${error}` });
        }
    },
};

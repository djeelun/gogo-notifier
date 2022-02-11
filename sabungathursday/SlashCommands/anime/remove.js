const { Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "remove",
    description: "Removes an anime from tracking for this channel",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'anime_name',
            description: 'Name of the anime to stop tracking',
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
                    anime.channels = anime.channels.filter(c => c != interaction.channelId);
                    await client.mongo_db.collection("anime-following").updateOne({ name: anime.name }, { $set: { channels: anime.channels } });
                    interaction.followUp({ content: `No longer notifying for ${anime_name} in <#${interaction.channelId}>.` });
                }
                else {
                    throw new Error(`Anime "${anime_name}" is not being tracked in this channel.`);
                }
            }
            else {
                throw new Error(`Anime "${anime_name}" is not being tracked.`);
            }

        } catch (error) {
            interaction.followUp({ content: `${error}` });
        }

        
    },
};

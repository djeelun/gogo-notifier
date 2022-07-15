const { Client, CommandInteraction } = require("discord.js");
const { collection } = require("../../config.json");

module.exports = {
    name: "purge",
    description: "Removes any anime that hasn't been updated in 2 weeks from tracking for this channel",
    type: 'CHAT_INPUT',
    options: [],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        
        try {
            // Delete every document that hasn't been updated in 2 weeks (or if last_updated doesn't exist at all)
            const deleted = await client.mongo_db.collection(collection).deleteMany({ 
                last_updated: { 
                    $or: [{
                        $lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
                    }, {
                        $exists: false
                    }]
                } 
            });
            interaction.followUp({ content: `Purged ${deleted.deletedCount} anime from the tracking list.` });

        } catch (error) {
            interaction.followUp({ content: `${error}` });
        }

        
    },
};

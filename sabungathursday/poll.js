const axios = require("axios");
const cheerio = require("cheerio");
const { poll_url } = require("./config.json");
const { MessageEmbed } = require('discord.js');

const sendEmbed = async ($, client, episode, anime, epNumber, link, imageUrl) => {

    try {
        
        const embed = new MessageEmbed()
            .setTitle(`${anime.name}`)
            .setURL(poll_url + link)
            .setColor(0x00ff00)
            .setDescription(`${epNumber} is now available!`)
            .setImage(imageUrl)
            .setTimestamp();

        for (let channelId of anime.channels) {

            ///TODO: REMOVE!!!
            // if (channelId != "939910029778235463") {
            //     continue;
            // }

            const channel = await client.channels.fetch(channelId);
            if (!channel) {
                console.log(`Channel ${channelId} not found.`);
                continue;
            } 
            await channel.send({ content: "@everyone", embeds: [embed] });
        }

    } catch (error) {
        console.error(error);
    }

}

module.exports = {
    poll: async (client) => {

        try {
            
            const following = await client.mongo_db.collection("anime-following").find({}).toArray();

            const { data } = await axios.get(poll_url);
            const $ = cheerio.load(data);

            const lastEpisodes = $(".last_episodes > .items > li");

            // Loop over all front page episodes
            for (let episode of lastEpisodes) {

                // Scrape data
                const name = $(episode).find(".name").text();
                const link = $(episode).find(".name > a").attr("href");
                const epNumber = $(episode).find(".episode").text();
                const imageUrl = $(episode).find(".img img").attr("src");

                // Find anime in database
                const anime = following.find((value) => value.name.toLowerCase() === name.toLowerCase());

                // Check if it is not already announced
                if (anime != null && anime.lastEp != epNumber) {
                    console.log(`NEW: ${name} - ${epNumber} - ${link}`);
                    await sendEmbed($, client, episode, anime, epNumber, link, imageUrl);

                    // Update lastEp
                    await client.mongo_db.collection("anime-following").updateOne({ name: anime.name }, { $set: { lastEp: epNumber } });
                }
                else {
                    // Debug
                    // console.log(`OLD: ${name} - ${epNumber} - ${link}`);
                }
            }

        } catch (error) {
            console.error(error);
        }

    }
}
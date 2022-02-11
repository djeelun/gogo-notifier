module.exports = {
    cleanup: async function (client) {
        await client.destroy();
        console.log("Bot has been shut down.");
        await client.mongo_client.close();
        console.log("MongoDB has been shut down.");

        if (client.pollInterval) {
            clearInterval(client.pollInterval);
            console.log("Polling has been shut down.");
        }

        process.exit(0);
    }
};
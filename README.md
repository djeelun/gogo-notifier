# gogo-notifier
Discord bot that notifies you when a new anime episode is uploaded (to GogoAnime)

## Configuration
Configure the bot by modifying the variables in the config.json file in the src directory. 
- The Discord bot token should be in the "token" field.
- The mongooseConnectionString field should have the url to the mongoDB connection string.
- The dbName should have the name of the database in the mongoDB
- The collection should have the name of the collection in the database

Feel free to replace the mongoDB dependencies with another database.

## Setup
Run `npm install` and `node index` in the src directory.

## Commands
**/list**
    Lists all anime tracked for this channel

**/add \<anime>**
    Adds anime to track in this channel
  
**/remove \<anime>**
    Removes a tracked anime in this channel

Feel free to add more commands

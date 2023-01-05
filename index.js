const Discord = require('discord.js');
const { youtube, spotify } = require('./services');

// Load the .env file
require('dotenv').config();

const client = new Discord.Client();

// Replace 'YOUR_BOT_TOKEN_HERE' with your bot's token
client.login(process.env.BOT_TOKEN);

client.on('message', message => {
    // Check if the message starts with '!play'
    if (message.content.startsWith('!play')) {
        // Get the search query or YouTube/Spotify link from the message
        const query = message.content.split(' ')[1];

        // Check if the query is a YouTube link
        if (query.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)) {
            // Get the YouTube video ID from the link
            const videoId = query.split('v=')[1];

            // Play the audio of the YouTube video
            youtube.play(videoId, message);
        } else {
            // Check if the query is a Spotify link
            if (query.match(/https?:\/\/(open|play)\.(spotify\.com)\/(track|album)\/[a-zA-Z0-9]{22}/)) {
                // Get the Spotify track or album ID from the link
                const id = query.split(/https?:\/\/(open|play)\.(spotify\.com)\/(track|album)\/([a-zA-Z0-9]{22})/)[4];

                // Play the audio of the Spotify track or album
                spotify.play(id, message);
            } else {
                // Search for YouTube and Spotify videos by keyword
                youtube.search(query, youtubeApiKey, (error, youtubeResults) => {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    // Get the first YouTube result
                    const youtubeResult = youtubeResults[0];

                    spotify.search(query, (error, spotifyResults) => {
                        if (error) {
                            console.error(error);
                            return;
                        }

                        // Get the first Spotify result
                        const spotifyResult = spotifyResults[0];

                        // Play the audio of the first YouTube or Spotify result
                        if (youtubeResult) {
                            youtube.play(youtubeResult.id.videoId, message);
                        } else if (spotifyResult) {
                            spotify.play(spotifyResult.id, message);
                        } else {
                            message.channel.send('No results found.');
                        }
                    });
                });
            }
        }
    }
});
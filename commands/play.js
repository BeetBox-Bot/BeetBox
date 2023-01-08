const { SlashCommandBuilder, InteractionCollector, ActivityType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const SpotifyWebApi = require('spotify-web-api-node');
const ytdl = require('ytdl-core');
const { google } = require('googleapis');
const { client } = require('..');
//const { client } = require('../index');

// init dotenv and API Keys
const dotenv = require('dotenv').config({ path: `${__dirname}/../.env` })
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays audio from YouTube or Spotify.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The YouTube or Spotify URL or search query.')
                .setRequired(true)),


    async execute(interaction, client) {
        await interaction.deferReply();
        const query = interaction.options.getString('query') ?? 'No URL or search provided!';

        let songTitle;
        // Check if the query is a YouTube URL
        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            // Get the videoId from the YouTube URL
            const videoId = query.match(/v=([^&]+)/) ? query.match(/v=([^&]+)/)[1] : null;

            if (!videoId) {
                console.error(`Invalid YouTube URL: ${query}`);
                return;
            }
            songTitle = playYoutubeVideo(videoId, interaction, client);
        } else {
            // Search for YouTube videos by keyword
            songTitle = searchYoutube(query, interaction, client);
        }
    },

    // Play the audio of a YouTube video
    const: playYoutubeVideo = (videoId, interaction, client) => {

        // Get the user's voice channel
        const voiceChannel = interaction.member.voice.channel;

        // Check if the user is in a voice channel
        if (!voiceChannel) {
            interaction.reply('You must be in a voice channel to play music!');
            return;
        }

        // Join the user's voice channel
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const link = `https://www.youtube.com/watch?v=${videoId}`

        const player = createAudioPlayer();
        const stream = ytdl(link, { filter: 'audioonly' });

        const resource = createAudioResource(stream);
        player.play(resource);

        // Subscribe the connection to the audio player (will play audio on the voice connection)
        connection.subscribe(player);

        async function getVideoTitle(youtubelink) {
            try {
                const response = await fetch(youtubelink);
                const data = await response.json();
                return data.title;
            } catch (error) {
                console.error(error);
            }
        }

        // Outputthe video title when the bot finds the song
        async function  updateActivity(client) {
            let title = await getVideoTitle(`https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${videoId}&format=json`);
            const string = "Now Playing: " + title + "";
            client.user.setActivity(title, { type: ActivityType.Playing });
            await interaction.editReply(string);
        }

        updateActivity(client);


        let timeout;
        player.on('stateChange', (oldState, newState) => {
            if (newState.status === 'playing') {
                clearTimeout(timeout);
            }

            // Leave voice channel when audio is finished playing and idle for two minutes
            if (newState.status === 'idle') {

                const timeout = setTimeout(() => {
                    connection.destroy();
                }, 120000);

            }

            // Leave voice channel when audio encounters an error
            if (newState.status === 'error') {
                console.error(newState.error);
                connection.destroy();
            }
        });

    },

    // Search for YouTube videos by keyword and play the first result
    const: searchYoutube = async (query, interaction, client) => {
        // Search for YouTube videos
        const response = await youtube.search.list({
            part: 'id',
            type: 'video',
            q: query,
        });

        // Get the first result
        const videoId = response.data.items[0].id.videoId;

        // Play the YouTube video
        playYoutubeVideo(videoId, interaction, client);
    },
};

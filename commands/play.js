const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const SpotifyWebApi = require('spotify-web-api-node');
const ytdl = require('ytdl-core');
const { google } = require('googleapis');

const dotenv = require('dotenv').config({path: '../.env'})

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


    async execute(interaction) {
        const query = interaction.options.getString('query') ?? 'No URL or search provided!';


        // Check if the query is a YouTube URL
        if (query.includes('youtube.com')) {
            // Play the YouTube video
            playYoutubeVideo(query, interaction);
        } else {
            // Search for YouTube videos by keyword
            searchYoutube(query, interaction);
        }
    },

    // Play the audio of a YouTube video
    const: playYoutubeVideo = (videoId, interaction) => {

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

        const player = createAudioPlayer();
        const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, { filter: 'audioonly' });
        const resource = createAudioResource(stream);
        player.play(resource);

        // Subscribe the connection to the audio player (will play audio on the voice connection)
        const subscription = connection.subscribe(player);

        // Leave voice channel when there is no activity for two minutes
        setTimeout(() => {
            connection.destroy();
        }
            , 120000);

    },

    // Search for YouTube videos by keyword and play the first result
    const: searchYoutube = async (query, interaction) => {
        // Search for YouTube videos
        const response = await youtube.search.list({
            part: 'id',
            type: 'video',
            q: query,
        });

        // Get the first result
        const videoId = response.data.items[0].id.videoId;

        // Play the YouTube video
        playYoutubeVideo(videoId, interaction);
    },

};
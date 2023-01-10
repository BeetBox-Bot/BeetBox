const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const { Youtube, searchYoutube } = require('../models/youtube');
const Spotify = './models/spotify';


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays audio from YouTube or Spotify.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The YouTube or Spotify URL or search query.')
                .setRequired(true)),


    async execute(interaction) {
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

        await interaction.deferReply();
        const query = interaction.options.getString('query') ?? 'No URL or search provided!';
        let song;

        // Check if the query is a YouTube URL
        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            // Get the videoId from the YouTube URL
            const videoId = query.match(/v=([^&]+)/) ? query.match(/v=([^&]+)/)[1] : null;

            if (!videoId) {
                console.error(`Invalid YouTube URL: ${query}`);
                return;
            }

            song = new Youtube(videoId);
        } else {
            // Search for YouTube videos by keyword
            // TODO something smart if there's no result
            song = new Youtube(await searchYoutube(query));
        }

        song.connection = connection;
        try {
            global.queue.push(song, interaction);
        }
        catch (e) {
            console.log(e);
        }
    },
};
